from enum import Enum

from trueskill import Rating, setup, expose
from db_constants import *
from api_constants import *

from collections import defaultdict

DEFAULT_MU = 25
DEFAULT_SIGMA = 25 / 3
DEFAULT_BETA = 25 / 6
DEFAULT_TAU = 25 / 300

setup(DEFAULT_MU, DEFAULT_SIGMA, DEFAULT_BETA, DEFAULT_TAU)


class TrueSkillRating:
    def __init__(self, pro_rating: Rating = None, pro_player_battle_count: int = None, user_rating: Rating = None,
                 user_battle_count: int = None, combined_rating: Rating = None, from_database=False):
        self.pro_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if pro_rating is None else pro_rating
        self.pro_player_battle_count = 0 if pro_player_battle_count is None else pro_player_battle_count

        if (pro_player_battle_count is not None and pro_rating is None) or \
                (pro_rating is not None and pro_player_battle_count is None):
            raise Exception("pro_rating and pro_player_battle_count must both be None or both be not None")

        self.user_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if user_rating is None else user_rating
        self.user_battle_count = 0 if user_battle_count is None else user_battle_count

        if (user_battle_count is not None and user_rating is None) or \
                (user_rating is not None and user_battle_count is None):
            raise Exception("user_rating and user_battle_count must both be None or both be not None")

        self.combined_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if combined_rating is None else combined_rating
        self.from_database = from_database

    def convert_to_api_data(self):
        return {
            API_PRO_PLAYER_RATING_MU_KEY: self.pro_rating.mu,
            API_PRO_PLAYER_RATING_SIGMA_KEY: self.pro_rating.sigma,
            API_PRO_PLAYER_BATTLE_COUNT_KEY: self.pro_player_battle_count,
            API_PRO_PLAYER_EXPOSURE_KEY: expose(self.pro_rating),
            API_APP_USER_RATING_MU_KEY: self.user_rating.mu,
            API_APP_USER_RATING_SIGMA_KEY: self.user_rating.sigma,
            API_APP_USER_BATTLE_COUNT_KEY: self.user_battle_count,
            API_APP_USER_EXPOSURE_KEY: expose(self.user_rating),
            API_COMBINED_RATING_MU_KEY: self.combined_rating.mu,
            API_COMBINED_RATING_SIGMA_KEY: self.combined_rating.sigma,
            API_COMBINED_EXPOSURE_KEY: expose(self.combined_rating)
        }


class PlayerType(Enum):
    PRO = 0
    USER = 1


class RatingType(Enum):
    GLOBAL = 0
    MODE = 1
    MAP = 2


class FactoryDefaultDict(defaultdict):
    def __missing__(self, key):
        self[key] = new = self.default_factory()
        return new


# TODO: add rating history
# noinspection PyUnresolvedReferences
class BrawlerTrueSkill:
    def __init__(self, brawler_name, cursor, connection):
        self.__cursor = cursor
        self.__conn = connection
        self.__brawler_name = brawler_name
        self.global_rating = None
        self.mode_ratings = FactoryDefaultDict(TrueSkillRating)  # SCHEMA: mode_name : TrueSkillRating
        self.map_ratings = FactoryDefaultDict(TrueSkillRating)  # SCHEMA: (mode_name, map_name) : TrueSkillRating

    def convert_to_api_data(self):
        data = {API_BRAWLER_NAME_KEY: self.__brawler_name,
                API_GLOBAL_RATING_KEY: self.global_rating.convert_to_api_data()}

        mode_data = {}
        for mode_name, mode_rating in self.mode_ratings.items():
            mode_data[mode_name] = mode_rating.convert_to_api_data()

        data[API_MODE_RATINGS_KEY] = mode_data

        map_data = {}
        for (mode_name, map_name), map_rating in self.map_ratings.items():
            if mode_name not in map_data:
                map_data[mode_name] = {}

            map_data[mode_name][map_name] = map_rating.convert_to_api_data()

        data[API_MAP_RATINGS_KEY] = map_data

        return data

    def update_ratings_to_db(self, mode, battle_map):
        # to remove apostrophes in map names
        battle_map = battle_map.replace("'", "")

        if not self.global_rating.from_database:
            self.insert_rating_to_db_rows(self.global_rating, RatingType.GLOBAL)
            self.global_rating.from_database = True
        else:
            self.update_rating_to_db_rows(self.global_rating, RatingType.GLOBAL)

        if not self.mode_ratings[mode].from_database:
            self.insert_rating_to_db_rows(self.mode_ratings[mode], RatingType.MODE, mode_name=mode)
            self.mode_ratings[mode].from_database = True
        else:
            self.update_rating_to_db_rows(self.mode_ratings[mode], RatingType.MODE, mode_name=mode)

        if not self.map_ratings[(mode, battle_map)].from_database:
            self.insert_rating_to_db_rows(self.map_ratings[(mode, battle_map)], RatingType.MAP, mode_name=mode,
                                          map_name=battle_map)
            self.map_ratings[(mode, battle_map)].from_database = True
        else:
            self.update_rating_to_db_rows(self.map_ratings[(mode, battle_map)], RatingType.MAP, mode_name=mode,
                                          map_name=battle_map)

    def populate_ratings(self):
        self.populate_global_rating()
        self.populate_mode_ratings()
        self.populate_map_ratings()

    def populate_global_rating(self):
        self.__cursor.execute(f"SELECT * FROM {SCHEMA_NAME}.\"{GLOBAL_RATING_TABLE}\" WHERE \"{BRAWLER_NAME_KEY}\" "
                              f"= \'{self.__brawler_name}\'")

        rows = self.__cursor.fetchall()
        rows_desc = {col.name: index for index, col in enumerate(self.__cursor.description)}

        if len(rows) == 0:
            # we can just insert a rating here now, if it doesn't exist, because you always need a global rating
            # map ratings are more specific
            self.global_rating = TrueSkillRating()
            self.insert_rating_to_db_rows(self.global_rating, RatingType.GLOBAL)
            self.global_rating.from_database = True
        elif len(rows) == 1:
            self.global_rating = BrawlerTrueSkill.get_rating_from_db_row(rows[0], rows_desc)
        else:
            raise Exception(f"More than one global rating for {self.__brawler_name}")

    def populate_mode_ratings(self):
        self.__cursor.execute(f"SELECT * FROM {SCHEMA_NAME}.\"{MODE_RATING_TABLE}\" WHERE \"{BRAWLER_NAME_KEY}\" "
                              f"= \'{self.__brawler_name}\'")

        rows = self.__cursor.fetchall()
        rows_desc = {col.name: index for index, col in enumerate(self.__cursor.description)}

        for row in rows:
            mode_name = row[rows_desc[MODE_NAME_KEY]]
            self.mode_ratings[mode_name] = BrawlerTrueSkill.get_rating_from_db_row(row, rows_desc)

    def populate_map_ratings(self):
        self.__cursor.execute(f"SELECT * FROM {SCHEMA_NAME}.\"{MAP_RATING_TABLE}\" WHERE \"{BRAWLER_NAME_KEY}\" "
                              f"= \'{self.__brawler_name}\'")

        rows = self.__cursor.fetchall()
        rows_desc = {col.name: index for index, col in enumerate(self.__cursor.description)}

        for row in rows:
            mode_name = row[rows_desc[MODE_NAME_KEY]]
            map_name = row[rows_desc[MAP_NAME_KEY]]
            self.map_ratings[(mode_name, map_name)] = BrawlerTrueSkill.get_rating_from_db_row(row, rows_desc)

    @staticmethod
    def get_rating_from_db_row(row, row_description: dict):
        return TrueSkillRating(
            Rating(row[row_description[PRO_PLAYER_MU_KEY]], row[row_description[PRO_PLAYER_SIGMA_KEY]]),
            row[row_description[PRO_PLAYER_BATTLE_COUNT_KEY]],
            Rating(row[row_description[USER_MU_KEY]], row[row_description[USER_SIGMA_KEY]]),
            row[row_description[USER_BATTLE_COUNT_KEY]],
            Rating(row[row_description[COMBINED_MU_KEY]], row[row_description[COMBINED_SIGMA_KEY]]),
            True
        )

    def insert_rating_to_db_rows(self, rating: TrueSkillRating, rating_type: RatingType, mode_name=None, map_name=None):
        if rating_type == RatingType.GLOBAL:
            self.__cursor.execute(f"INSERT INTO {SCHEMA_NAME}.\"{GLOBAL_RATING_TABLE}\" "
                                  f"("
                                  f"\"{BRAWLER_NAME_KEY}\", \"{PRO_PLAYER_MU_KEY}\", \"{PRO_PLAYER_SIGMA_KEY}\", "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\", \"{USER_MU_KEY}\", \"{USER_SIGMA_KEY}\", "
                                  f"\"{USER_BATTLE_COUNT_KEY}\", \"{COMBINED_MU_KEY}\", \"{COMBINED_SIGMA_KEY}\""
                                  f") "
                                  f"VALUES "
                                  f"("
                                  f"\'{self.__brawler_name}\', {rating.pro_rating.mu}, {rating.pro_rating.sigma}, "
                                  f"{rating.pro_player_battle_count}, {rating.user_rating.mu}, "
                                  f"{rating.user_rating.sigma}, "
                                  f"{rating.user_battle_count}, {rating.combined_rating.mu}, "
                                  f"{rating.combined_rating.sigma}"
                                  f");")
        elif rating_type == RatingType.MODE:
            if mode_name is None:
                raise Exception("mode_name must be provided for mode rating")

            self.__cursor.execute(f"INSERT INTO {SCHEMA_NAME}.\"{MODE_RATING_TABLE}\" "
                                  f"("
                                  f"\"{BRAWLER_NAME_KEY}\", \"{PRO_PLAYER_MU_KEY}\", \"{PRO_PLAYER_SIGMA_KEY}\", "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\", \"{USER_MU_KEY}\", \"{USER_SIGMA_KEY}\", "
                                  f"\"{USER_BATTLE_COUNT_KEY}\", \"{COMBINED_MU_KEY}\", \"{COMBINED_SIGMA_KEY}\", "
                                  f"\"{MODE_NAME_KEY}\""
                                  f") "
                                  f"VALUES "
                                  f"("
                                  f"\'{self.__brawler_name}\', {rating.pro_rating.mu}, {rating.pro_rating.sigma}, "
                                  f"{rating.pro_player_battle_count}, {rating.user_rating.mu}, "
                                  f"{rating.user_rating.sigma}, "
                                  f"{rating.user_battle_count}, {rating.combined_rating.mu}, "
                                  f"{rating.combined_rating.sigma}, \'{mode_name}\'"
                                  f");")
        elif rating_type == RatingType.MAP:
            if mode_name is None or map_name is None:
                raise Exception("mode_name and map_name must be provided for map rating")

            self.__cursor.execute(f"INSERT INTO {SCHEMA_NAME}.\"{MAP_RATING_TABLE}\" "
                                  f"("
                                  f"\"{BRAWLER_NAME_KEY}\", \"{PRO_PLAYER_MU_KEY}\", \"{PRO_PLAYER_SIGMA_KEY}\", "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\", \"{USER_MU_KEY}\", \"{USER_SIGMA_KEY}\", "
                                  f"\"{USER_BATTLE_COUNT_KEY}\", \"{COMBINED_MU_KEY}\", \"{COMBINED_SIGMA_KEY}\", "
                                  f"\"{MODE_NAME_KEY}\", \"{MAP_NAME_KEY}\""
                                  f") "
                                  f"VALUES "
                                  f"("
                                  f"\'{self.__brawler_name}\', {rating.pro_rating.mu}, {rating.pro_rating.sigma}, "
                                  f"{rating.pro_player_battle_count}, {rating.user_rating.mu}, "
                                  f"{rating.user_rating.sigma}, "
                                  f"{rating.user_battle_count}, {rating.combined_rating.mu}, "
                                  f"{rating.combined_rating.sigma}, \'{mode_name}\', \'{map_name}\'"
                                  f");")
        else:
            raise Exception(f"Invalid rating type: {rating_type}")

        self.__conn.commit()

    def update_rating_to_db_rows(self, rating: TrueSkillRating, rating_type: RatingType, mode_name=None, map_name=None):
        if rating_type == RatingType.GLOBAL:
            self.__cursor.execute(f"UPDATE {SCHEMA_NAME}.\"{GLOBAL_RATING_TABLE}\" "
                                  f"SET "
                                  f"\"{PRO_PLAYER_MU_KEY}\" = {rating.pro_rating.mu}, "
                                  f"\"{PRO_PLAYER_SIGMA_KEY}\" = {rating.pro_rating.sigma}, "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\" = {rating.pro_player_battle_count}, "
                                  f"\"{USER_MU_KEY}\" = {rating.user_rating.mu}, "
                                  f"\"{USER_SIGMA_KEY}\" = {rating.user_rating.sigma}, "
                                  f"\"{USER_BATTLE_COUNT_KEY}\" = {rating.user_battle_count}, "
                                  f"\"{COMBINED_MU_KEY}\" = {rating.combined_rating.mu}, "
                                  f"\"{COMBINED_SIGMA_KEY}\" = {rating.combined_rating.sigma} "
                                  f"WHERE \"{BRAWLER_NAME_KEY}\" = \'{self.__brawler_name}\';")
        elif rating_type == RatingType.MODE:
            if mode_name is None:
                raise Exception("mode_name must be provided for mode rating")

            self.__cursor.execute(f"UPDATE {SCHEMA_NAME}.\"{MODE_RATING_TABLE}\" "
                                  f"SET "
                                  f"\"{PRO_PLAYER_MU_KEY}\" = {rating.pro_rating.mu}, "
                                  f"\"{PRO_PLAYER_SIGMA_KEY}\" = {rating.pro_rating.sigma}, "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\" = {rating.pro_player_battle_count}, "
                                  f"\"{USER_MU_KEY}\" = {rating.user_rating.mu}, "
                                  f"\"{USER_SIGMA_KEY}\" = {rating.user_rating.sigma}, "
                                  f"\"{USER_BATTLE_COUNT_KEY}\" = {rating.user_battle_count}, "
                                  f"\"{COMBINED_MU_KEY}\" = {rating.combined_rating.mu}, "
                                  f"\"{COMBINED_SIGMA_KEY}\" = {rating.combined_rating.sigma} "
                                  f"WHERE "
                                  f"\"{BRAWLER_NAME_KEY}\" = \'{self.__brawler_name}\' AND"
                                  f"\"{MODE_NAME_KEY}\" = \'{mode_name}\';")
        elif rating_type == RatingType.MAP:
            if mode_name is None or map_name is None:
                raise Exception("mode_name and map_name must be provided for map rating")

            self.__cursor.execute(f"UPDATE {SCHEMA_NAME}.\"{MAP_RATING_TABLE}\" "
                                  f"SET "
                                  f"\"{PRO_PLAYER_MU_KEY}\" = {rating.pro_rating.mu}, "
                                  f"\"{PRO_PLAYER_SIGMA_KEY}\" = {rating.pro_rating.sigma}, "
                                  f"\"{PRO_PLAYER_BATTLE_COUNT_KEY}\" = {rating.pro_player_battle_count}, "
                                  f"\"{USER_MU_KEY}\" = {rating.user_rating.mu}, "
                                  f"\"{USER_SIGMA_KEY}\" = {rating.user_rating.sigma}, "
                                  f"\"{USER_BATTLE_COUNT_KEY}\" = {rating.user_battle_count}, "
                                  f"\"{COMBINED_MU_KEY}\" = {rating.combined_rating.mu}, "
                                  f"\"{COMBINED_SIGMA_KEY}\" = {rating.combined_rating.sigma} "
                                  f"WHERE "
                                  f"\"{BRAWLER_NAME_KEY}\" = \'{self.__brawler_name}\' AND"
                                  f"\"{MODE_NAME_KEY}\" = \'{mode_name}\' AND"
                                  f"\"{MAP_NAME_KEY}\" = \'{map_name}\';")

        else:
            raise Exception(f"Invalid rating type: {rating_type}")

        self.__conn.commit()
