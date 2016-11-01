import requests
from requests.exceptions import RequestException
import json

from flask import current_app, jsonify

from . import data


@data.route("/")
def load():
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Connection': 'close'}

    try:
        response = requests.request(
            method = "GET",
            url = current_app.config.get("DATA_URL"),
            params = {
                "id": current_app.config.get("DATA_ID"),
                "apikey": current_app.config.get("DATA_API_KEY")
            },
            data = None,
            headers = headers
        )
        response.encoding = "utf-8"
        response.raise_for_status()

        data = response.json()
        data["status"] = "OK"
    except RequestException as e:
        data = {"status": "ERROR", "type": type(e).__name__} 

    return jsonify(data)