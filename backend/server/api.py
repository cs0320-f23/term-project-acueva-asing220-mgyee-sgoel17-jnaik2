from flask import Flask, request
from flask_cors import CORS
from backend.server.brawlstars_api import endpoints as api
from backend.server.server_state import ServerState

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


@app.route('/getPlayerBattleLog')
def get_player_battle_log():
    player_tag = request.args.get('player_tag')
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
    player_tag = request.args.get('player_tag')
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
    brawler_name = request.args.get('brawler_name')
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


if __name__ == '__main__':
    serverState = ServerState()
    app.run(host='localhost', port=8000, debug=True)
