import requests

from brawlstars_api.responses import BSAPIResponse, BSAPIResponseType
from brawlstars_api.constants import PLAYERS_ENDPOINT, GLOBAL_PLAYER_RANKING_ENDPOINT, \
    MAP_ROTATION_ENDPOINT, GLOBAL_PLAYER_RANKING_BY_BRAWLER_ENDPOINT, BRAWLER_NAMES_ENDPOINT
from brawlstars_api.keys import API_KEY  # add your own keys.py


def get_player_battle_log(player_tag) -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to get the battle log data

    :param player_tag: a string representing the player tag of a Brawl Stars user
    :returns: A JSON containing all the battle log data of the user from the past day
    """

    try:
        api_url = f"{PLAYERS_ENDPOINT}/%23{player_tag}/battlelog"
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", data)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)


def get_player_inventory(player_tag) -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to get a Brawl Stars user's player data

    :param player_tag: a string representing the player tag of a Brawl Stars user
    :returns: A JSON containing the user's owned brawlers, gadgets, accessories and more
    """

    try:
        api_url = f"{PLAYERS_ENDPOINT}/%23{player_tag}"
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", data)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)


def get_top_global_players() -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to get the global player tags

    :returns: A JSON containing the top 200 players' tags in the world
    """

    try:
        api_url = GLOBAL_PLAYER_RANKING_ENDPOINT
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", data)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)


def get_top_global_players_by_brawler(brawler_id) -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to get the global player tags

    :param brawler_id: ID of the brawler to get the top players for
    :return: A JSON containing the top 200 players' tags in the world for the specified brawler
    """

    try:
        api_url = f"{GLOBAL_PLAYER_RANKING_BY_BRAWLER_ENDPOINT}/{brawler_id}"
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", data)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)


def get_map_rotation() -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to get the ongoing event rotation

    :returns: Returns a JSON containing the current map and mode pairs that are in use at time of request
    """

    try:
        api_url = MAP_ROTATION_ENDPOINT
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", data)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)


def populate_brawler_data(brawler_id_dict) -> BSAPIResponse:
    """
    Makes an API GET request to the BrawlStars API to populate the global dictionary with brawler name to ID

    :param brawler_id_dict: dictionary to populate with brawler name-id pairs
    :returns: No data, but populates the dictionary passed in
    """

    try:
        api_url = BRAWLER_NAMES_ENDPOINT
        headers = {
            'Authorization': f'Bearer {API_KEY}',
        }
        response = requests.get(api_url, headers=headers)
        response.raise_for_status()
        data = response.json()
        for brawler in data['items']:
            brawler_id_dict[brawler['name'].upper()] = brawler['id']
        return BSAPIResponse(BSAPIResponseType.SUCCESS, "", None)
    except requests.HTTPError as http_err:
        return BSAPIResponse(BSAPIResponseType.HTTP_ERROR, f'Error occurred: {http_err}', None)
    except Exception as err:
        return BSAPIResponse(BSAPIResponseType.OTHER_ERROR, f'Error occurred: {err}', None)
