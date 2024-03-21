import os
import datetime
import json
import requests
import dotenv

dotenv.load_dotenv()

API_KEY = os.getenv("API_KEY")
X_RAPIDAPI_KEY = os.getenv("X_RAPIDAPI_KEY")

def log_response_data(data, prefix=""):
    """
    Logs the response data to a JSON file.

    Args:
        data (dict): The response data to be logged.
        prefix (str, optional): The prefix to be added to the filename. Defaults to "".
    """
    timestamp = datetime.datetime.now().strftime("%Y%m%d%H%M%S")
    filename = f"responses/{prefix}_{timestamp}.json"
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    with open(filename, 'w') as f:
        json.dump(data, f)


# TODO: Implement another function to get location ID from address:
# Look at the following documentation for more information: 
# https://developers.google.com/maps/documentation/places/web-service/text-search?hl=tr&apix_params=%7B%22fields%22%3A%22places.id%2Cplaces.name%22%2C%22resource%22%3A%7B%22textQuery%22%3A%22De%20Librije%2C%20Spinhuisplein%201%2C%20Zwolle%2C%208011%20ZZ%2C%20Netherlands%22%7D%7D#about_response
def get_google_location_id(lat, lon):
    """
    Retrieves the Google location ID based on latitude and longitude.

    Args:
        lat (float): The latitude.
        lon (float): The longitude.

    Returns:
        str: The Google location ID.
    """
    url = f"https://maps.googleapis.com/maps/api/geocode/json?latlng={lat},{lon}&result_type=point_of_interest&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    
    log_response_data(data, prefix=f"geocode_{lat}_{lon}")

    return data['results'][0]['place_id']
    
def get_google_location_details(location_id):
    """
    Retrieves the details of a Google location based on its ID.

    Args:
        location_id (str): The Google location ID.

    Returns:
        dict: The details of the Google location.
    """
    url = f"https://places.googleapis.com/v1/places/{location_id}?fields=*&key={API_KEY}"
    response = requests.get(url)
    data = response.json()

    log_response_data(data, prefix=f"places_{location_id}")

    return data

def get_the_fork_data(location_id):
    """
    Retrieves data about a restaurant from The Fork API.

    Args:
        location_id (str): The location ID of the restaurant.

    Returns:
        dict: The data about the restaurant.
    """
    url = "https://the-fork-the-spoon.p.rapidapi.com/restaurants/v2/get-info"

    querystring = {"restaurantId": location_id}

    headers = {
        "X-RapidAPI-Key": X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)

    log_response_data(response.json(), prefix=f"the_fork_{querystring['restaurantId']}")
    return response.json()

def get_the_fork_autocomplete(text_to_search):
    """
    Retrieves auto-complete suggestions for a search query from The Fork API.

    Args:
        text_to_search (str): The text to search for.

    Returns:
        dict: The auto-complete suggestions.
    """
    url = "https://the-fork-the-spoon.p.rapidapi.com/locations/v2/auto-complete"

    querystring = {"text": text_to_search}

    headers = {
        "X-RapidAPI-Key": X_RAPIDAPI_KEY,
        "X-RapidAPI-Host": "the-fork-the-spoon.p.rapidapi.com"
    }

    response = requests.get(url, headers=headers, params=querystring)
    log_response_data(response.json(), prefix=f"the_fork_auto_complete_{text_to_search}")

    return response.json()
