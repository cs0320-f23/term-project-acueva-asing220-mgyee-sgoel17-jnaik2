from flask import Flask, request
from flask_cors import CORS
import brawlstars_api.endpoints as wl


app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/getBattleLog')
def get_battle_log():
    player_tag = request.args.get('player_tag')

    if not player_tag:
        return None
    response = wl.get_player_battle_log(player_tag)
    return response.data

@app.route('/getPlayerData')
def get_player_data():
    player_tag = request.args.get('player_tag')
    if not player_tag:
        return None
    response = wl.get_player_inventory(player_tag)
    # if response.is_error():
    #     return response.error_message    
    return response.data

@app.route('/getBestGlobalPlayers')
def get_best_global_players():
    response = wl.get_top_global_players()
    # if response.is_error():
    #     return response.error_message
    return response.data
    

@app.route('/getMapRotation')
def get_map_rotation():
    response = wl.get_map_rotation()
    # if response.is_error():
    #     return response.error_message
    return response.data

@app.route('/populateBrawlerData')
def populate_brawler_data():
    BRAWLER_NAME_TO_ID = dict()
    wl.populate_brawler_data(BRAWLER_NAME_TO_ID)
    return list(BRAWLER_NAME_TO_ID.items())

@app.route('/getIcon')
def get_icon():
    id = request.args.get('id')
    

if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)


