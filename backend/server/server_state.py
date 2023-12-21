import os
from postgres_setup import initialize_postgresql
from brawlstars_api.endpoints import populate_brawler_data
from trueskill_utils import BrawlerTrueSkill, PlayerType

from trueskill import rate, setup

BATTLE_HASHES_LOCATION = "battle_hashes"


class ServerState:
    """
    This class is a singleton that holds all of the state for the server.
    """
    def __init__(self):
        """
        Initializes the server state.
        """
        self.brawler_name_store = BrawlerNameStore()
        self.battle_hash_store = BattleHashStore()
        self.cursor, self.conn = initialize_postgresql()
        self.brawler_rating_manager = BrawlerRatingsManager(self.cursor, self.conn)


class BrawlerNameStore:
    """
    This class stores all of the brawler names and their corresponding ids.
    """
    def __init__(self):
        """
        Initializes the brawler name store.
        """
        self.brawler_name_to_id = {}
        self.brawler_id_to_name = {}
        self.populate_brawler_names()

    def populate_brawler_names(self):
        """
        Populates the brawler names.
        """
        response = populate_brawler_data(self.brawler_name_to_id)

        if response.is_error():
            raise Exception(f"Error populating brawler data: {response.error_message}")
        else:
            print("Successfully populated brawler data.")
            self.brawler_id_to_name = {v: k for k, v in self.brawler_name_to_id.items()}

    def check_if_brawler_exists(self, brawler_name):
        """
        Checks if a brawler exists.

        :param brawler_name: name of the brawler
        :return: True if the brawler exists, False otherwise
        """
        return brawler_name.upper() in self.brawler_name_to_id

    def get_brawler_id_from_name(self, brawler_name):
        """
        Gets the brawler id from the brawler name.

        :param brawler_name: name of the brawler
        :return: brawler id
        """
        return self.brawler_name_to_id[brawler_name.upper()]

    def get_brawler_name_from_id(self, brawler_id):
        """
        Gets the brawler name from the brawler id.

        :param brawler_id: an id of a brawler
        :return: the name of the brawler associated with that id
        """
        return self.brawler_id_to_name[brawler_id]


class BattleHashStore:
    """
    This class stores all of the battle hashes.
    """
    def __init__(self):
        """
        Initializes the battle hash store.
        """
        self.battle_hashes = {}
        self.loaded_times = {}

    @staticmethod
    def get_battle_hash(battle_data):
        """
        Gets the battle hash from the battle data.

        :param battle_data: data for the battle
        :return: returns the respective hash
        """
        battle_time = BattleHashStore.get_battle_time(battle_data)
        battle_team1 = [player["tag"] for player in battle_data["battle"]["teams"][0]]
        battle_team2 = [player["tag"] for player in battle_data["battle"]["teams"][1]]
        players = []

        players.extend(battle_team1)
        players.extend(battle_team2)
        players.sort()  # very important to preserve a deterministic order

        return f"{battle_time}{''.join(players)}"

    @staticmethod
    def get_battle_time(battle_data):
        """
        Get the battle time from the battle data.

        :param battle_data: data for the battle
        :return: returns the respective time
        """
        return battle_data["battleTime"]

    @staticmethod
    def get_battle_time_at_hour(battle_time):
        """
        Gets the hour the battle took place at.

        :param battle_time: time of the battle
        :return: get the hour at the battle time
        """
        return battle_time[:11]

    def load_battles_from_disk(self, battle_time):
        """
        Loads the battles from disk.

        :param battle_time: time of the battle
        """
        battle_time_at_hour = BattleHashStore.get_battle_time_at_hour(battle_time)

        if battle_time_at_hour in self.loaded_times:
            return

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
        """
        Adds a battle to the store.

        :param battle_hash: hash of the battle to add
        :param battle_time: time of the battle to add
        """
        self.battle_hashes[battle_hash] = True
        battle_time_at_hour = BattleHashStore.get_battle_time_at_hour(battle_time)

        filename = f"battles-{battle_time_at_hour}.txt"
        with open(f"{BATTLE_HASHES_LOCATION}/{filename}", "a+") as f:
            f.write(f"{battle_hash}\n")

        self.load_battles_from_disk(battle_time)

    def check_if_battle_exists(self, battle_hash, battle_time):
        """
        Checks if a battle exists.

        :param battle_hash: hash of the battle to check for
        :param battle_time: the time the battle took place
        :return: whether or not the battle exists
        """
        self.load_battles_from_disk(battle_time)

        return self.battle_hashes[battle_hash] is not None


class BrawlerRatingsManager:
    """
    This class manages the brawler ratings.
    """
    def __init__(self, cursor, conn):
        """
        Initializes the brawler ratings manager.

        :param cursor: cursor to the postgresql database
        :param conn: connection to the postgresql database
        """
        self.__cursor = cursor
        self.__conn = conn
        self.brawler_name_to_trueskill = {}

    def get_trueskill(self, brawler_name) -> BrawlerTrueSkill:
        """
        Gets the trueskill rating for a brawler.

        :param brawler_name: the name of the brawler
        :return: returns the trueskill rating for the brawler
        """
        self.load_trueskill_from_db(brawler_name)
        return self.brawler_name_to_trueskill[brawler_name]

    def load_trueskill_from_db(self, brawler_name):
        """
        Loads the trueskill rating for a brawler from the database.

        :param brawler_name: the name of the brawler to load
        """
        if brawler_name in self.brawler_name_to_trueskill:
            return

        rating = BrawlerTrueSkill(brawler_name, self.__cursor, self.__conn)
        rating.populate_ratings()
        self.brawler_name_to_trueskill[brawler_name] = rating

    def register_battle(self, winning_brawlers, losing_brawlers, mode_name, map_name, player_type: PlayerType,
                        was_draw):
        """
        Registers a battle.

        :param winning_brawlers: names of the winning brawlers
        :param losing_brawlers: names of the losing brawlers
        :param mode_name: name of the mode
        :param map_name: name of the map
        :param player_type: type of the player playing
        :param was_draw: whether it was a draw or not
        """
        # get the TrueSkillRating objects for everyone
        winning_brawlers_ratings = [self.get_trueskill(brawler) for brawler in winning_brawlers]
        losing_brawlers_ratings = [self.get_trueskill(brawler) for brawler in losing_brawlers]

        # get the global ratings for each
        winning_brawlers_global_ratings = [rating.global_rating for rating in winning_brawlers_ratings]
        losing_brawlers_global_ratings = [rating.global_rating for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_global_ratings, losing_brawlers_global_ratings,
                                             player_type, was_draw)

        # get the mode ratings for each
        winning_brawlers_mode_ratings = [rating.mode_ratings[mode_name] for rating in winning_brawlers_ratings]
        losing_brawlers_mode_ratings = [rating.mode_ratings[mode_name] for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_mode_ratings, losing_brawlers_mode_ratings,
                                             player_type, was_draw)

        # get the map ratings for each
        winning_brawlers_map_ratings = [rating.map_ratings[(mode_name, map_name)] for rating in
                                        winning_brawlers_ratings]
        losing_brawlers_map_ratings = [rating.map_ratings[(mode_name, map_name)] for rating in losing_brawlers_ratings]

        BrawlerRatingsManager.update_ratings(winning_brawlers_map_ratings, losing_brawlers_map_ratings,
                                             player_type, was_draw)

        for rating in winning_brawlers_ratings:
            rating.update_ratings_to_db(mode_name, map_name)

        for rating in losing_brawlers_ratings:
            rating.update_ratings_to_db(mode_name, map_name)

    @staticmethod
    def update_ratings(winners_ratings, losers_ratings, player_type: PlayerType, was_draw):
        """
        Updates the ratings.

        :param winners_ratings: the rating objects of the winners
        :param losers_ratings: the rating objects of the losers
        :param player_type: type of the player
        :param was_draw: whetehr it was a draw or not
        :return:
        """
        if player_type == PlayerType.PRO:
            BrawlerRatingsManager.update_pro_player_ratings(winners_ratings, losers_ratings, was_draw)
        elif player_type == PlayerType.USER:
            BrawlerRatingsManager.update_app_user_ratings(winners_ratings, losers_ratings, was_draw)
        else:
            raise Exception(f"Invalid player type: {player_type}")

        BrawlerRatingsManager.update_combined_ratings(winners_ratings, losers_ratings, was_draw)

    @staticmethod
    def update_pro_player_ratings(winners_ratings, losers_ratings, was_draw):
        """
        Updates the pro player ratings.

        :param winners_ratings: the rating objects of the winners
        :param losers_ratings: the rating objects of the losers
        :param was_draw: whether the battle was a draw or not
        """
        winners_orig_ratings = [rating.pro_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.pro_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings],
                                                       ranks=[0, 1] if not was_draw else [0, 0])

        for i in range(len(winners_ratings)):
            winners_ratings[i].pro_rating = winners_new_ratings[i]
            winners_ratings[i].pro_player_battle_count += 1

        for i in range(len(losers_ratings)):
            losers_ratings[i].pro_rating = losers_new_ratings[i]
            losers_ratings[i].pro_player_battle_count += 1

    @staticmethod
    def update_app_user_ratings(winners_ratings, losers_ratings, was_draw):
        """
        Updates the app user ratings.

        :param winners_ratings: the rating objects of the winners
        :param losers_ratings: the rating objects of the losers
        :param was_draw: whether the battle was a draw or not
        """
        winners_orig_ratings = [rating.user_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.user_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings],
                                                       ranks=[0, 1] if not was_draw else [0, 0])

        for i in range(len(winners_ratings)):
            winners_ratings[i].user_rating = winners_new_ratings[i]
            winners_ratings[i].user_battle_count += 1

        for i in range(len(losers_ratings)):
            losers_ratings[i].user_rating = losers_new_ratings[i]
            losers_ratings[i].user_battle_count += 1

    @staticmethod
    def update_combined_ratings(winners_ratings, losers_ratings, was_draw):
        """
        Updates the combined ratings.

        :param winners_ratings: the rating objects of the winners
        :param losers_ratings: the rating objects of the losers
        :param was_draw: whether the battle was a draw or not
        """
        winners_orig_ratings = [rating.combined_rating for rating in winners_ratings]
        losers_orig_ratings = [rating.combined_rating for rating in losers_ratings]

        winners_new_ratings, losers_new_ratings = rate([winners_orig_ratings, losers_orig_ratings],
                                                       ranks=[0, 1] if not was_draw else [0, 0])

        for i in range(len(winners_ratings)):
            winners_ratings[i].combined_rating = winners_new_ratings[i]

        for i in range(len(losers_ratings)):
            losers_ratings[i].combined_rating = losers_new_ratings[i]
