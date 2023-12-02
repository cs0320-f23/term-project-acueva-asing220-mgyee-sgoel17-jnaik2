import requests
from private.private import API_KEY
#there is no private in server dir real, hea yea ik telling u so u dont run same command 20 times 
PLAYERS_ENDPOINT = "https://api.brawlstars.com/v1/players/"
BEST_GLOBAL_PLAYER_DATA = "https://api.brawlstars.com/v1/rankings/global"

"""
Desc: 
Makes an API GET request to the BrawlStars API to get the battle log data

Args:
playerTag: a string representing the playertag of a Brawl Stars user

Returns:
A JSON containing all the battle log data of the user from the past day
"""
def getBattleLog(playerTag: str):
    try:
        API_URL =f"https://api.brawlstars.com/v1/players/%23{playerTag}/battlelog"
        headers = {
        'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.HTTPError as http_err: 
        return (f'HTTP error occurred: {http_err}')
    except Exception as err:
        return (f'Other error occurred: {err}')

"""
Desc: 
Makes an API GET request to the BrawlStars API to get a Brawl Stars user's
player data 

Args:
playerTag: a string representing the playertag of a Brawl Stars user

Returns:
A JSON containing the user's owned brawlers,gadgets, accessories and more
"""
def getPlayerData(playerTag: str):
    try:
        API_URL = f"https://api.brawlstars.com/v1/players/%23{playerTag}"
        headers = {
        'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.HTTPError as http_err: 
        return (f'HTTP error occurred: {http_err}')
    except Exception as err:
        return (f'Other error occurred: {err}')
        
"""
Desc: 
Makes an API GET request to the BrawlStars API to get the global player tags

Args:
None

Returns:
A JSON containing the top 200 players' tags in the world for a 
"""
def getBestGlobalPlayersTAG():
    try:
        API_URL = BEST_GLOBAL_PLAYER_DATA
        headers = {
        'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.HTTPError as http_err: 
        return (f'HTTP error occurred: {http_err}')
    except Exception as err:
        return (f'Other error occurred: {err}')

"""
Desc: 
Makes an API GET request to the BrawlStars API to get the ongoing event rotation

Args:
None

Returns:
Returns a JSON containing the current map and mode pairs that are in use at 
time of request
"""   
def getMapRotation():
    try:
        API_URL = "https://api.brawlstars.com/v1/events/rotation"
        headers = {
        'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        return data
    except requests.HTTPError as http_err: 
        return (f'HTTP error occurred: {http_err}')
    except Exception as err:
        return (f'Other error occurred: {err}') 
    
"""
Desc: 
Makes an API GET request to the BrawlStars API to populate the global dictionary
with brawler name to ID

Args:
None

Returns:
Success or failure
"""   
def populateBrawlerData():
    try:
        API_URL = "https://api.brawlstars.com/v1/brawlers"
        headers = {
        'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(API_URL, headers=headers)
        response.raise_for_status()
        data = response.json()
        return "success"
    except requests.HTTPError as http_err: 
        return (f'HTTP error occurred: {http_err}')
    except Exception as err:
        return (f'Other error occurred: {err}')
    

#print(getBattleLog("22Q90QJV"))