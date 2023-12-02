from flask import Flask, request
from flask_cors import CORS
import wrapperLibrary as wl
BRAWLER_TO_DATA: dict = {}
BRAWLER_TO_TOP_PLAYER_IDS: dict = {}


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route('/getBattleLog')
def get_battle_log():
    player_tag = request.args.get('player_tag')
    if not player_tag:
        return None
    data = wl.getBattleLog(player_tag)
    return data

@app.route('/getPlayerData')
def get_player_data():
    player_tag = request.args.get('player_tag')
    if not player_tag:
        return None
    data = wl.getPlayerData(player_tag)
    return data

@app.route('/getBestGlobalPlayers')
def get_best_global_players():
    brawler_id = request.args.get("brawler_id")
    data = wl.getBestGlobalPlayersTAG(brawler_id)
    return data

@app.route('/getMapRotation')
def get_map_rotation():
    data = wl.getMapRotation()
    return data

@app.route('/populateBrawlerData')
def populate_brawler_data():
    data = wl.populateBrawlerData()
    # print(data)
    for brawler in data['items']: 
        BRAWLER_TO_DATA[brawler['name']] = brawler
    return BRAWLER_TO_DATA

@app.route('/populateTopBrawlerData')
def get_best_players_by_brawler():
    for brawlerName, brawlerInformation in BRAWLER_TO_DATA.items():
        BRAWLER_TO_TOP_PLAYER_IDS[brawlerName] = [player['tag'] for player in wl.getBestGlobalPlayersTAG(brawlerInformation["id"])['items']]  
    return BRAWLER_TO_TOP_PLAYER_IDS
    

if __name__ == '__main__':
    populate_brawler_data()
    app.run(host='localhost', port=8000, debug=True)


