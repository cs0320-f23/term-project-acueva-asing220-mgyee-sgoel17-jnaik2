import asyncio

from flask import Flask, request
from flask_cors import CORS
from brawlstars_api import endpoints as api
from server_state import ServerState

import asyncio as aio

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/getPlayerBattleLog')
def get_player_battle_log():
    player_tag = request.args.get('playerTag')
    if not player_tag:
        return {
            "status": "error",
            "message": "No player tag provided"
        }, 400

    response = api.get_player_battle_log(player_tag)
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

    response = api.get_player_inventory(player_tag)
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
    response = api.get_top_global_players()
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

    brawler_id = serverState.brawler_name_store.get_brawler_id_from_name(brawler_name)
    response = api.get_top_global_players_by_brawler(brawler_id)
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
    response = api.get_map_rotation()
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

    if not serverState.brawler_name_store.check_if_brawler_exists(brawler_name):
        return {
            "status": "error",
            "message": "Invalid brawler name!"
        }, 400

    trueskill = serverState.brawler_rating_manager.get_trueskill(brawler_name)

    return {
        "status": "success",
        "data": trueskill.convert_to_api_data()
    }, 200


@app.route('/getAllBrawlers')
def get_all_brawlers():
    brawler_name_to_id_dict = serverState.brawler_name_store.brawler_name_to_id
    data = [(k, v) for k, v in brawler_name_to_id_dict.items()]

    return {
        "status": "success",
        "data": data
    }, 200


if __name__ == '__main__':
    serverState = ServerState()
    app.run(host='localhost', port=8000, debug=True)
