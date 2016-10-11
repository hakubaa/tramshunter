from . import data
from flask import current_app, jsonify
import requests


@data.route("/")
def load():
    headers = {'Content-Type': 'application/json',
               'Accept': 'application/json',
               'Connection': 'close'}

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
    response.raise_for_status()
    response.encoding = "utf-8"

    return jsonify(**response.json())