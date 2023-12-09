import traceback
from datetime import datetime

from flask import Flask, request
from flask_cors import CORS

import server_state
from brawlstars_api import endpoints as bs_api
from server_state import ServerState, BattleHashStore

from flask_apscheduler import APScheduler

from api_constants import BS_RESULT_WIN, BS_RESULT_LOSS, BS_RESULT_DRAW
from trueskill_utils import PlayerType

app = Flask(__name__)
scheduler = APScheduler()
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/getPlayerBattleLog')
def get_player_battle_log():
    player_tag = request.args.get('playerTag')
    if not player_tag:
        return {
            "status": "error",
            "message": "No player tag provided"
        }, 400

    response = bs_api.get_player_battle_log(player_tag)
    if response.is_error():
        return {
            "status": "error",
            "message": response.error_message
        }, 400
    else:
        return {
            "status": "success",
            "data": response.data
        }, 200


@app.route('/getPlayerInventory')
def get_player_inventory():
    player_tag = request.args.get('playerTag')
    if not player_tag:
        return {
            "status": "error",
            "message": "No player tag provided"
        }, 400

    response = bs_api.get_player_inventory(player_tag)
    if response.is_error():
        return {
            "status": "error",
            "message": response.error_message
        }, 400
    else:
        return {
            "status": "success",
            "data": response.data
        }, 200


@app.route('/getTopGlobalPlayers')
def get_top_global_players():
    response = bs_api.get_top_global_players()
    if response.is_error():
        return {
            "status": "error",
            "message": response.error_message
        }, 400
    else:
        return {
            "status": "success",
            "data": response.data
        }, 200


@app.route('/getTopGlobalPlayersByBrawler')
def get_top_global_players_by_brawler():
    brawler_name = request.args.get('brawlerName')
    if not brawler_name:
        return {
            "status": "error",
            "message": "No brawler id provided"
        }, 400

    brawler_id = server_state.brawler_name_store.get_brawler_id_from_name(brawler_name)
    response = bs_api.get_top_global_players_by_brawler(brawler_id)
    if response.is_error():
        return {
            "status": "error",
            "message": response.error_message
        }, 400
    else:
        return {
            "status": "success",
            "data": response.data
        }, 200


@app.route('/getMapRotation')
def get_map_rotation():
    response = bs_api.get_map_rotation()
    if response.is_error():
        return {
            "status": "error",
            "message": response.error_message
        }, 400
    else:
        return {
            "status": "success",
            "data": response.data
        }, 200


@app.route('/getBrawlerRating')
def get_brawler_rating():
    brawler_name = request.args.get('brawlerName')

    if not server_state.brawler_name_store.check_if_brawler_exists(brawler_name):
        return {
            "status": "error",
            "message": "Invalid brawler name!"
        }, 400

    trueskill = server_state.brawler_rating_manager.get_trueskill(brawler_name)

    return {
        "status": "success",
        "data": trueskill.convert_to_api_data()
    }, 200


@app.route('/getAllBrawlers')
def get_all_brawlers():
    brawler_name_to_id_dict = server_state.brawler_name_store.brawler_name_to_id
    data = [(k, v) for k, v in brawler_name_to_id_dict.items()]

    start = datetime.now()
    print(f"TIME NOW: {start}")
    update_brawler_ratings_from_pro_play()
    end = datetime.now()
    print(f"TIME NOW: {end}")
    print(f"ELAPSED: {end - start}")

    return {
        "status": "success",
        "data": data
    }, 200


@scheduler.task('interval', id='update_brawler_ratings_from_pro_play', minutes=60)
def update_brawler_ratings_from_pro_play():
    print(f"CRON | Updating brawler ratings from pro play... Current Time: {datetime.now()}")

    top_players = []

    # get top global players
    response = bs_api.get_top_global_players()
    if response.is_error():
        print(f"CRON | ERROR getting top global players: {response.error_message}")
        return

    top_global_players_tags = [player["tag"] for player in response.data["items"]]
    top_players.extend(top_global_players_tags)

    # get top players by brawler
    for brawler_name, brawler_id in server_state.brawler_name_store.brawler_name_to_id.items():
        response = bs_api.get_top_global_players_by_brawler(brawler_id)
        if response.is_error():
            print(f"CRON | ERROR getting top global players by brawler ({brawler_name}): {response.error_message}")
            continue

        top_global_players_on_brawler = [player["tag"] for player in response.data["items"]]
        top_players.extend(top_global_players_on_brawler)

    print(f"CRON | STATUS all pro player tags acquired")

    total_logs_processed = 0
    average_player_process_time = 0
    last_timestamp = datetime.now()

    # get battle logs for top players, and feed into rating system
    for i, player in enumerate(top_players):
        if last_timestamp is not None:
            elapsed_time = datetime.now() - last_timestamp
            average_player_process_time = (average_player_process_time * i + elapsed_time.seconds * 1000) / (i + 1)
            last_timestamp = datetime.now()
            print(f"CRON | STATUS average player processing time: {average_player_process_time} ms")
            print(f"CRON | STATUS estimated time remaining: "
                  f"{average_player_process_time * (len(top_players) - i) / 60000} minutes")

        print(f"CRON | STATUS processing player ({player}) | Number {i} of {len(top_players)} | "
              f"Total Battles Processed: {total_logs_processed}")

        response = bs_api.get_player_battle_log(player[1:])
        if response.is_error():
            print(f"CRON | ERROR getting battle log for player ({player}): {response.error_message}")
            continue

        battle_logs = response.data["items"]
        print(f"CRON | STATUS battle logs to process: {len(battle_logs)}")
        for battle_log in battle_logs:
            if "showdown" in battle_log["battle"]["mode"].lower():
                continue

            battle_hash = BattleHashStore.get_battle_hash(battle_log)
            if battle_hash in server_state.battle_hash_store.battle_hashes:
                print(f"CRON | STATUS battle hash ({battle_hash}) already processed")
                continue

            try:
                # register in hash
                battle_time = BattleHashStore.get_battle_time(battle_log)
                server_state.battle_hash_store.add_battle(battle_hash, battle_time)

                battle_players_team = [player["brawler"]["name"] for player in battle_log["battle"]["teams"][0]]
                battle_opponents_team = [player["brawler"]["name"] for player in battle_log["battle"]["teams"][1]]

                battle_result = battle_log["battle"]["result"]

                winning_brawlers = None
                losing_brawlers = None
                was_draw = False

                if battle_result == BS_RESULT_WIN:
                    winning_brawlers = battle_players_team
                    losing_brawlers = battle_opponents_team
                elif battle_result == BS_RESULT_LOSS:
                    winning_brawlers = battle_opponents_team
                    losing_brawlers = battle_players_team
                elif battle_result == BS_RESULT_DRAW:
                    was_draw = True
                else:
                    raise Exception(f"Invalid battle result: {battle_result}")

                battle_mode = battle_log["event"]["mode"]
                battle_map = battle_log["event"]["map"]

                server_state.brawler_rating_manager.register_battle(winning_brawlers, losing_brawlers, battle_mode,
                                                                    battle_map, PlayerType.PRO, was_draw)

                total_logs_processed += 1
            except Exception as e:
                print(f"CRON | ERROR processing battle ({battle_hash}): {e}")
                print(f"CRON | STATUS continuing after error")
                continue


if __name__ == '__main__':
    server_state = ServerState()
    scheduler.init_app(app)
    scheduler.start()
    app.run(host='localhost', port=8000, debug=True)
