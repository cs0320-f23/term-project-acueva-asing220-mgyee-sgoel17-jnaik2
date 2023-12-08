import os
from firebase_setup import initialize_firebase
from brawlstars_api.endpoints import populate_brawler_data
from trueskill_utils import BrawlerTrueSkill, TrueSkillRating, PlayerType

from trueskill import rate

BATTLE_HASHES_LOCATION = "battle_hashes"


class ServerState:
    def __init__(self):
        self.brawler_name_store = BrawlerNameStore()
        self.battle_hash_store = BattleHashStore()
        self.db = initialize_firebase()
        self.brawler_rating_manager = BrawlerRatingsManager(self.db)


class BrawlerNameStore:
    def __init__(self):
        self.brawler_name_to_id = {}
        self.brawler_id_to_name = {}
        self.populate_brawler_names()

    def populate_brawler_names(self):
        response = populate_brawler_data(self.brawler_name_to_id)

        if response.is_error():
            raise Exception(f"Error populating brawler data: {response.error_message}")
        else:
            print("Successfully populated brawler data.")
            self.brawler_id_to_name = {v: k for k, v in self.brawler_name_to_id.items()}

    def check_if_brawler_exists(self, brawler_name):
        return brawler_name.upper() in self.brawler_name_to_id

    def get_brawler_id_from_name(self, brawler_name):
        return self.brawler_name_to_id[brawler_name.upper()]

    def get_brawler_name_from_id(self, brawler_id):
        return self.brawler_id_to_name[brawler_id]


class BattleHashStore:
    def __init__(self):
        self.battle_hashes = {}
        self.loaded_times = {}

    @staticmethod
    def get_battle_hash(battle_data):
        battle_time = BattleHashStore.get_battle_time(battle_data)
        battle_team1 = [player["tag"][1:] for player in battle_data["battle"]["teams"][0]]
        battle_team2 = [player["tag"][1:] for player in battle_data["battle"]["teams"][1]]
        players = []

        players.extend(battle_team1)
        players.extend(battle_team2)
        players.sort()

        return f"{battle_time}{''.join(players)}"

    @staticmethod
    def get_battle_time(battle_data):
        return battle_data["battleTime"]

    @staticmethod
    def get_battle_time_at_hour(battle_time):
        return battle_time[:11]

    def load_battles_from_disk(self, battle_time):
        if battle_time in self.loaded_times:
            return

        battle_time_at_hour = BattleHashStore.get_battle_time_at_hour(battle_time)

        current_dir_contents = os.listdir()
        if BATTLE_HASHES_LOCATION in current_dir_contents:
            battle_hashes_dir_contents = os.listdir(BATTLE_HASHES_LOCATION)
            filename = f"battles-{battle_time_at_hour}.txt"
            if filename in battle_hashes_dir_contents:
                with open(f"{BATTLE_HASHES_LOCATION}/{filename}", "r") as f:
                    for line in f:
                        self.battle_hashes[line.strip()] = True

        self.loaded_times[battle_time_at_hour] = True

    def add_battle(self, battle_hash, battle_time):
        self.battle_hashes[battle_hash] = True
        battle_time_at_hour = BattleHashStore.get_battle_time_at_hour(battle_time)

        filename = f"battles-{battle_time_at_hour}.txt"
        with open(f"{BATTLE_HASHES_LOCATION}/{filename}", "a+") as f:
            f.write(f"{battle_hash}\n")

        self.load_battles_from_disk(battle_time)

    def check_if_battle_exists(self, battle_hash, battle_time):
        battle_time_at_hour = BattleHashStore.get_battle_time_at_hour(battle_time)
        self.load_battles_from_disk(battle_time)

        return self.battle_hashes[battle_hash] is not None


class BrawlerRatingsManager:
    def __init__(self, db):
        self.__db = db
        self.brawler_name_to_trueskill = {}

    async def get_trueskill(self, brawler_name) -> BrawlerTrueSkill:
        await self.load_trueskill_from_db(brawler_name)
        return self.brawler_name_to_trueskill[brawler_name]

    async def load_trueskill_from_db(self, brawler_name):
        if brawler_name in self.brawler_name_to_trueskill:
            return

        rating = BrawlerTrueSkill(brawler_name, self.__db)
        await rating.populate_ratings()
        self.brawler_name_to_trueskill[brawler_name] = rating

    async def register_battle(self, winning_brawlers, losing_brawlers, mode_name, map_name, player_type: PlayerType):
        # get the TrueSkillRating objects for everyone
        winning_brawlers_ratings = [self.get_trueskill(brawler) for brawler in winning_brawlers]
        losing_brawlers_ratings = [self.get_trueskill(brawler) for brawler in losing_brawlers]

        # get the global ratings for each
        winning_brawlers_global_ratings = [rating.global_rating for rating in winning_brawlers_ratings]
        losing_brawlers_global_ratings = [rating.global_rating for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_global_ratings, losing_brawlers_global_ratings,
                                             player_type)

        # get the mode ratings for each
        winning_brawlers_mode_ratings = [rating.mode_ratings[mode_name] for rating in winning_brawlers_ratings]
        losing_brawlers_mode_ratings = [rating.mode_ratings[mode_name] for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_mode_ratings, losing_brawlers_mode_ratings,
                                             player_type)

        # get the map ratings for each
        winning_brawlers_map_ratings = [rating.map_ratings[(mode_name, map_name)] for rating in
                                        winning_brawlers_ratings]
        losing_brawlers_map_ratings = [rating.map_ratings[(mode_name, map_name)] for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_map_ratings, losing_brawlers_map_ratings,
                                             player_type)

        for rating in winning_brawlers_ratings:
            await rating.update_ratings_to_db(mode_name, map_name)

        for rating in losing_brawlers_ratings:
            await rating.update_ratings_to_db(mode_name, map_name)

    @staticmethod
    def update_ratings(winners_ratings, losers_ratings, player_type: PlayerType):
        if player_type == PlayerType.PRO:
            BrawlerRatingsManager.update_pro_player_ratings(winners_ratings, losers_ratings)
        elif player_type == PlayerType.USER:
            BrawlerRatingsManager.update_app_user_ratings(winners_ratings, losers_ratings)
        else:
            raise Exception(f"Invalid player type: {player_type}")

        BrawlerRatingsManager.update_combined_ratings(winners_ratings, losers_ratings)

    @staticmethod
    def update_pro_player_ratings(winners_ratings, losers_ratings):
        winners_orig_ratings = [rating.pro_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.pro_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings], ranks=[0, 1])

        for i in range(len(winners_ratings)):
            winners_ratings[i].pro_rating = winners_new_ratings[i]
            winners_ratings[i].pro_player_battle_count += 1

        for i in range(len(losers_ratings)):
            losers_ratings[i].pro_rating = losers_new_ratings[i]
            losers_ratings[i].pro_player_battle_count += 1

    @staticmethod
    def update_app_user_ratings(winners_ratings, losers_ratings):
        winners_orig_ratings = [rating.user_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.user_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings], ranks=[0, 1])

        for i in range(len(winners_ratings)):
            winners_ratings[i].user_rating = winners_new_ratings[i]
            winners_ratings[i].user_battle_count += 1

        for i in range(len(losers_ratings)):
            losers_ratings[i].user_rating = losers_new_ratings[i]
            losers_ratings[i].user_battle_count += 1

    @staticmethod
    def update_combined_ratings(winners_ratings, losers_ratings):
        winners_orig_ratings = [rating.combined_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.combined_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings], ranks=[0, 1])

        for i in range(len(winners_ratings)):
            winners_ratings[i].combined_rating = winners_new_ratings[i]

        for i in range(len(losers_ratings)):
            losers_ratings[i].combined_rating = losers_new_ratings[i]
