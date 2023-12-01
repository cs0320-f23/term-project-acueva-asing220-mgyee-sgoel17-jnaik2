from flask import Flask, request
from flask_cors import CORS
import wrapperLibrary as wl

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
    data = wl.getBestGlobalPlayersTAG()
    return data

@app.route('/getMapRotation')
def get_map_rotation():
    data = wl.getMapRotation()
    return data

@app.route('/populateBrawlerData')
def populate_brawler_data():
    data = wl.populateBrawlerData()
    return data

if __name__ == '__main__':
    app.run(host='localhost', port=8000, debug=True)


