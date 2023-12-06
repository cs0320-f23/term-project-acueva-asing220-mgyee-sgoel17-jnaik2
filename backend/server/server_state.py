import os

from backend.server.brawlstars_api.endpoints import populate_brawler_data

BATTLE_HASHES_LOCATION = "battle_hashes"


class ServerState:
    def __init__(self):
        self.brawler_name_store = BrawlerNameStore()
        self.battle_hash_store = BattleHashStore()


class BrawlerNameStore:
    def __init__(self):
        self.brawler_name_to_id = {}
        self.brawler_id_to_name = {}
        self.populate_brawler_data()

    def populate_brawler_data(self):
        response = populate_brawler_data(self.brawler_name_to_id)

        if response.is_error():
            raise Exception(f"Error populating brawler data: {response.error_message}")
        else:
            print("Successfully populated brawler data.")
            self.brawler_id_to_name = {v: k for k, v in self.brawler_name_to_id.items()}

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
