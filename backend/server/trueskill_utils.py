from enum import Enum

from trueskill import Rating
from db_constants import *

DEFAULT_MU = 25
DEFAULT_SIGMA = 25 / 3


# TODO: add rating history
# noinspection PyUnresolvedReferences
class BrawlerTrueSkill:
    def __init__(self, brawler_name, db):
        self.__db = db
        self.__brawler_name = brawler_name
        self.global_rating = None
        self.mode_ratings = {}  # SCHEMA: mode_name : TrueSkillRating
        self.map_ratings = {}  # SCHEMA: (mode_name, map_name) : TrueSkillRating

    async def update_ratings_to_db(self, mode, battle_map):
        await self.update_global_rating_to_db()
        await self.update_mode_ratings_to_db(mode)
        await self.update_map_ratings_to_db(mode, battle_map)

    async def update_global_rating_to_db(self):
        global_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(GLOBAL_RATING_DOCUMENT) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        await BrawlerTrueSkill.set_rating_to_doc(global_rating_doc_ref, self.global_rating)

    async def update_mode_rating_to_db(self, mode):
        mode_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MODE_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION) \
            .document(mode) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        await BrawlerTrueSkill.set_rating_to_doc(mode_rating_doc_ref, self.mode_ratings[mode])

    async def update_map_rating_to_db(self, mode, battle_map):
        map_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MAP_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION) \
            .document(mode) \
            .collection(MAPS_SUB_COLLECTION) \
            .document(battle_map) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        await BrawlerTrueSkill.set_rating_to_doc(map_rating_doc_ref, self.map_ratings[(mode, battle_map)])

    async def populate_ratings(self):
        await self.populate_global_rating()
        await self.populate_mode_ratings()
        await self.populate_map_ratings()

    async def populate_global_rating(self):
        global_rating_doc_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(GLOBAL_RATING_DOCUMENT) \
            .collection(BRAWLERS_SUB_COLLECTION) \
            .document(self.__brawler_name.upper())

        global_rating_doc = await global_rating_doc_ref.get()

        self.global_rating = await BrawlerTrueSkill.get_rating_from_doc(global_rating_doc_ref, global_rating_doc)

    async def populate_mode_ratings(self):
        modes_collection_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MODE_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION)

        mode_docs = modes_collection_ref.stream()

        async for mode_doc in mode_docs:
            mode_name = mode_doc.id

            mode_rating_doc_ref = modes_collection_ref \
                .document(mode_name) \
                .collection(BRAWLERS_SUB_COLLECTION) \
                .document(self.__brawler_name.upper())

            mode_rating_doc = await mode_rating_doc_ref.get()

            self.mode_ratings[mode_name] = await BrawlerTrueSkill.get_rating_from_doc(mode_rating_doc_ref,
                                                                                      mode_rating_doc)

    async def populate_map_ratings(self):
        maps_modes_collection_ref = self.__db \
            .collection(TOP_LEVEL_COLLECTION) \
            .document(MAP_RATING_DOCUMENT) \
            .collection(MODES_SUB_COLLECTION)

        maps_mode_docs = maps_modes_collection_ref.stream()

        async for mode_doc in maps_mode_docs:
            mode_name = mode_doc.id
            maps_collection_ref = maps_modes_collection_ref \
                .document(mode_name) \
                .collection(MAPS_SUB_COLLECTION)

            map_docs = maps_collection_ref.stream()

            async for map_doc in map_docs:
                map_name = map_doc.id
                map_rating_doc_ref = maps_collection_ref \
                    .document(map_name) \
                    .collection(BRAWLERS_SUB_COLLECTION)\
                    .document(self.__brawler_name.upper())

                map_rating_doc = await map_rating_doc_ref.get()

                self.map_ratings[(mode_name, map_name)] = \
                    await BrawlerTrueSkill.get_rating_from_doc(map_rating_doc_ref, map_rating_doc)

    @staticmethod
    def get_rating_from_doc(document_ref, document):
        if not document.exists:
            rating = TrueSkillRating()
            await BrawlerTrueSkill.set_rating_to_doc(document_ref, rating)
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
        await document_ref.set({
            PRO_PLAYER_MU_KEY: rating.pro_rating.mu,
            PRO_PLAYER_SIGMA_KEY: rating.pro_rating.sigma,
            PRO_PLAYER_BATTLE_COUNT_KEY: rating.pro_player_battle_count,
            USER_MU_KEY: rating.user_rating.mu,
            USER_SIGMA_KEY: rating.user_rating.sigma,
            USER_BATTLE_COUNT_KEY: rating.user_battle_count,
            COMBINED_MU_KEY: rating.combined_rating.mu,
            COMBINED_SIGMA_KEY: rating.combined_rating.sigma
        })


class TrueSkillRating:
    def __init__(self, pro_rating=None, pro_player_battle_count=None, user_rating=None, user_battle_count=None,
                 combined_rating=None):
        self.pro_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if pro_rating is None else pro_rating
        self.pro_player_battle_count = 0 if pro_player_battle_count is None else pro_player_battle_count

        if pro_player_battle_count and not pro_rating or pro_rating and not pro_player_battle_count:
            raise Exception("pro_rating and pro_player_battle_count must both be None or both be not None")

        self.user_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if user_rating is None else user_rating
        self.user_battle_count = 0 if user_battle_count is None else user_battle_count

        if user_battle_count and not user_rating or user_rating and not user_battle_count:
            raise Exception("user_rating and user_battle_count must both be None or both be not None")

        self.combined_rating = Rating(DEFAULT_MU, DEFAULT_SIGMA) if combined_rating is None else combined_rating


class PlayerType(Enum):
    PRO = 0
    USER = 1
