import unittest

from backend.server.trueskill_utils import PlayerType
from server_state import ServerState, BattleHashStore


class TestServerState(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.server_state = ServerState()

    def test_brawler_name_store(self):
        self.assertTrue(self.server_state.brawler_name_store.check_if_brawler_exists("SHELLY"))
        shelly_id = self.server_state.brawler_name_store.get_brawler_id_from_name("SHELLY")
        self.assertEquals(self.server_state.brawler_name_store.get_brawler_name_from_id(shelly_id), "SHELLY")

    def test_battle_hash_store(self):
        battle_data = {
            "battle": {
                "teams": [
                    [{"tag": "#A1"}, {"tag": "#A2"}, {"tag": "#A3"}],
                    [{"tag": "#B1"}, {"tag": "#B2"}, {"tag": "#B3"}]
                ]
            },
            "battleTime": "20230428T163641.000Z"
        }

        self.assertEquals(BattleHashStore.get_battle_hash(battle_data), "20230428T163641.000Z#A1#A2#A3#B1#B2#B3")
        self.assertEquals(BattleHashStore.get_battle_time(battle_data), "20230428T163641.000Z")
        self.assertEquals(BattleHashStore.get_battle_time_at_hour("20230428T163641.000Z"), "20230428T16")

        battle_hash = BattleHashStore.get_battle_hash(battle_data)
        battle_time = BattleHashStore.get_battle_time(battle_data)

        self.server_state.battle_hash_store.add_battle(battle_hash, battle_time)
        self.server_state.battle_hash_store.check_if_battle_exists(battle_hash, battle_time)

    def test_brawler_ratings_mgr(self):
        trueskill = self.server_state.brawler_rating_manager.get_trueskill("SHELLY")
        self.assertIsNotNone(trueskill.global_rating.combined_rating.mu)
        self.assertIsNotNone(trueskill.global_rating.combined_rating.sigma)

        self.assertGreater(len(trueskill.mode_ratings), 0)
        self.assertGreater(len(trueskill.map_ratings), 0)

        num = trueskill.global_rating.pro_player_battle_count

        self.server_state.brawler_rating_manager.register_battle(["SHELLY", "COLT", "BROCK"],
                                                                 ["BULL", "JESSIE", "NITA"],
                                                                 "mode", "map", PlayerType.PRO, False)

        trueskill = self.server_state.brawler_rating_manager.get_trueskill("SHELLY")
        self.assertEqual(trueskill.global_rating.pro_player_battle_count, num + 1)
