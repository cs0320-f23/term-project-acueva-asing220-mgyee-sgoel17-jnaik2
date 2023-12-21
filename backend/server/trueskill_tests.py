import unittest

from trueskill import Rating

from trueskill_utils import BrawlerTrueSkill, TrueSkillRating, FactoryDefaultDict
from api_constants import *
from postgres_setup import initialize_postgresql


class TestTrueSkillRating(unittest.TestCase):
    def test_convert_to_api_data(self):
        trueskill_rating = TrueSkillRating(Rating(25, 8),
                                           100,
                                           Rating(25, 8),
                                           200,
                                           Rating(25, 8),
                                           False)

        api_data = trueskill_rating.convert_to_api_data()
        self.assertEquals(api_data[API_PRO_PLAYER_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_PRO_PLAYER_RATING_SIGMA_KEY], 8)
        self.assertEquals(api_data[API_PRO_PLAYER_BATTLE_COUNT_KEY], 100)
        self.assertEquals(api_data[API_APP_USER_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_APP_USER_RATING_SIGMA_KEY], 8)
        self.assertEquals(api_data[API_APP_USER_BATTLE_COUNT_KEY], 200)
        self.assertEquals(api_data[API_COMBINED_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_COMBINED_RATING_SIGMA_KEY], 8)

    def test_convert_default_to_api_data(self):
        trueskill_rating = TrueSkillRating()

        api_data = trueskill_rating.convert_to_api_data()
        self.assertEquals(api_data[API_PRO_PLAYER_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_PRO_PLAYER_RATING_SIGMA_KEY], 25 / 3)
        self.assertEquals(api_data[API_PRO_PLAYER_BATTLE_COUNT_KEY], 0)
        self.assertEquals(api_data[API_APP_USER_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_APP_USER_RATING_SIGMA_KEY], 25 / 3)
        self.assertEquals(api_data[API_APP_USER_BATTLE_COUNT_KEY], 0)
        self.assertEquals(api_data[API_COMBINED_RATING_MU_KEY], 25)
        self.assertEquals(api_data[API_COMBINED_RATING_SIGMA_KEY], 25 / 3)


class TestFactoryDefaultDict(unittest.TestCase):
    def test_default_factory(self):
        default_dict = FactoryDefaultDict(TrueSkillRating)
        self.assertEquals(type(default_dict["test"]), TrueSkillRating)


class TestBrawlerTrueSkill(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.cursor, cls.conn = initialize_postgresql()

    def test_convert_default_to_api_data(self):
        brawler_true_skill = BrawlerTrueSkill("test-brawler", self.cursor, self.conn)

        with self.assertRaises(Exception):
            api_data = brawler_true_skill.convert_to_api_data()

    def test_new_brawler_rating_system(self):
        brawler_true_skill = BrawlerTrueSkill("test-brawler3", self.cursor, self.conn)

        brawler_true_skill.populate_ratings()
        self.assertEquals(brawler_true_skill.global_rating.pro_rating.mu, 25)
        self.assertEquals(brawler_true_skill.global_rating.user_rating.mu, 25)
        self.assertEquals(brawler_true_skill.global_rating.combined_rating.mu, 25)

        self.assertEquals(len(brawler_true_skill.mode_ratings), 0)
        self.assertEquals(len(brawler_true_skill.map_ratings), 0)

        # we expect this to work because of the factory default dict
        self.assertEquals(brawler_true_skill.mode_ratings["test-mode"].pro_rating.mu, 25)
        self.assertEquals(brawler_true_skill.mode_ratings["test-mode"].user_rating.mu, 25)
        self.assertEquals(brawler_true_skill.mode_ratings["test-mode"].combined_rating.mu, 25)

        # we expect this to work because of the factory default dict
        self.assertEquals(brawler_true_skill.map_ratings[("test-mode", "test-map")].pro_rating.mu, 25)
        self.assertEquals(brawler_true_skill.map_ratings[("test-mode", "test-map")].user_rating.mu, 25)
        self.assertEquals(brawler_true_skill.map_ratings[("test-mode", "test-map")].combined_rating.mu, 25)

        brawler_true_skill.update_ratings_to_db("test-mode", "test-map")

        brawler_true_skill2 = BrawlerTrueSkill("test-brawler3", self.cursor, self.conn)
        brawler_true_skill2.populate_ratings()
        self.assertEquals(brawler_true_skill2.global_rating.pro_rating.mu, 25)
        self.assertEquals(len(brawler_true_skill.mode_ratings), 1)
        self.assertEquals(len(brawler_true_skill.map_ratings), 1)


