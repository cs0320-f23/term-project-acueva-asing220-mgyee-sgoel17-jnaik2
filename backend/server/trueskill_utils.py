from enum import Enum

from trueskill import Rating
from db_constants import *
from api_constants import *

from collections import defaultdict

DEFAULT_MU = 25
DEFAULT_SIGMA = 25 / 3


class TrueSkillRating:
    def __init__(self, pro_rating=None, pro_player_battle_count=None, user_rating=None, user_battle_count=None,
                 combined_rating=None):
        self.pro_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if pro_rating is None else pro_rating
        self.pro_player_battle_count = 0 if pro_player_battle_count is None else pro_player_battle_count

        if (pro_player_battle_count is not None and pro_rating is None) or\
                (pro_rating is not None and pro_player_battle_count is None):
            raise Exception("pro_rating and pro_player_battle_count must both be None or both be not None")

        self.user_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if user_rating is None else user_rating
        self.user_battle_count = 0 if user_battle_count is None else user_battle_count

        if (user_battle_count is not None and user_rating is None) or \
                (user_rating is not None and user_battle_count is None):
            raise Exception("user_rating and user_battle_count must both be None or both be not None")

        self.combined_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if combined_rating is None else combined_rating

    def convert_to_api_data(self):
        return {
            API_PRO_PLAYER_RATING_MU_KEY: self.pro_rating.mu,
            API_PRO_PLAYER_RATING_SIGMA_KEY: self.pro_rating.sigma,
            API_PRO_PLAYER_BATTLE_COUNT_KEY: self.pro_player_battle_count,
            API_APP_USER_RATING_MU_KEY: self.user_rating.mu,
            API_APP_USER_RATING_SIGMA_KEY: self.user_rating.sigma,
            API_APP_USER_BATTLE_COUNT_KEY: self.user_battle_count,
            API_COMBINED_RATING_MU_KEY: self.combined_rating.mu,
            API_COMBINED_RATING_SIGMA_KEY: self.combined_rating.sigma
        }


class FactoryDefaultDict(defaultdict):
    def __missing__(self, key):
        self[key] = new = self.default_factory()
        return new


# TODO: add rating history
# noinspection PyUnresolvedReferences
class BrawlerTrueSkill:
    def __init__(self, brawler_name, db):
        self.__db = db
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
            map_data[mode_name] = {}
            map_data[mode_name][map_name] = map_rating.convert_to_api_data()

        data[API_MAP_RATINGS_KEY] = map_data

        return data

    def update_ratings_to_db(self, mode, battle_map):
        self.update_global_rating_to_db()
        self.update_mode_ratings_to_db(mode)
        self.update_map_ratings_to_db(mode, battle_map)

    def update_global_rating_to_db(self):
        global_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(GLOBAL_RATING_DOCUMENT) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        BrawlerTrueSkill.set_rating_to_doc(global_rating_doc_ref, self.global_rating)

    def update_mode_ratings_to_db(self, mode):
        mode_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MODE_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION) \
            .document(mode) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        BrawlerTrueSkill.set_rating_to_doc(mode_rating_doc_ref, self.mode_ratings[mode])

    def update_map_ratings_to_db(self, mode, battle_map):
        map_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MAP_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION) \
            .document(mode) \
            .collection(MAPS_SUB_COLLECTION) \
            .document(battle_map) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        BrawlerTrueSkill.set_rating_to_doc(map_rating_doc_ref, self.map_ratings[(mode, battle_map)])

    def populate_ratings(self):
        self.populate_global_rating()
        self.populate_mode_ratings()
        self.populate_map_ratings()

    def populate_global_rating(self):
        global_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(GLOBAL_RATING_DOCUMENT) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        global_rating_doc = global_rating_doc_ref.get()

        self.global_rating = BrawlerTrueSkill.get_rating_from_doc(global_rating_doc_ref, global_rating_doc)

    def populate_mode_ratings(self):
        modes_collection_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MODE_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION)

        mode_docs = modes_collection_ref.stream()

        for mode_doc in mode_docs:
            mode_name = mode_doc.id

            mode_rating_doc_ref = modes_collection_ref \
                .document(mode_name) \
                .collection(BRAWLERS_SUB_COLLECTION) \
                .document(self.__brawler_name.upper())

            mode_rating_doc = mode_rating_doc_ref.get()

            self.mode_ratings[mode_name] = BrawlerTrueSkill.get_rating_from_doc(mode_rating_doc_ref, mode_rating_doc)

    def populate_map_ratings(self):
        maps_modes_collection_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MAP_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION)

        maps_mode_docs = maps_modes_collection_ref.stream()

        for mode_doc in maps_mode_docs:
            mode_name = mode_doc.id
            maps_collection_ref = maps_modes_collection_ref \
                .document(mode_name) \
                .collection(MAPS_SUB_COLLECTION)

            map_docs = maps_collection_ref.stream()

            for map_doc in map_docs:
                map_name = map_doc.id
                map_rating_doc_ref = maps_collection_ref \
                    .document(map_name) \
                    .collection(BRAWLERS_SUB_COLLECTION)\
                    .document(self.__brawler_name.upper())

                map_rating_doc = map_rating_doc_ref.get()

                self.map_ratings[(mode_name, map_name)] = \
                    BrawlerTrueSkill.get_rating_from_doc(map_rating_doc_ref, map_rating_doc)

    @staticmethod
    def get_rating_from_doc(document_ref, document):
        if not document.exists:
            rating = TrueSkillRating()
            BrawlerTrueSkill.set_rating_to_doc(document_ref, rating)
            return rating
        else:
            data = document.to_dict()

            return TrueSkillRating(
                Rating(data[PRO_PLAYER_MU_KEY], data[PRO_PLAYER_SIGMA_KEY]),
                data[PRO_PLAYER_BATTLE_COUNT_KEY],
                Rating(data[USER_MU_KEY], data[USER_SIGMA_KEY]),
                data[USER_BATTLE_COUNT_KEY],
                Rating(data[COMBINED_MU_KEY], data[COMBINED_SIGMA_KEY])
            )

    @staticmethod
    def set_rating_to_doc(document_ref, rating: TrueSkillRating):
        document_ref.set({
            PRO_PLAYER_MU_KEY: rating.pro_rating.mu,
            PRO_PLAYER_SIGMA_KEY: rating.pro_rating.sigma,
            PRO_PLAYER_BATTLE_COUNT_KEY: rating.pro_player_battle_count,
            USER_MU_KEY: rating.user_rating.mu,
            USER_SIGMA_KEY: rating.user_rating.sigma,
            USER_BATTLE_COUNT_KEY: rating.user_battle_count,
            COMBINED_MU_KEY: rating.combined_rating.mu,
            COMBINED_SIGMA_KEY: rating.combined_rating.sigma
        })


class PlayerType(Enum):
    PRO = 0
    USER = 1
