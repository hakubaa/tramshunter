from flask import current_app, url_for
from app import create_app

import unittest
from unittest.mock import Mock, patch, ANY
import json


@patch("app.data.views.requests.request")
class DataTestCase(unittest.TestCase):


    def setUp(self):
        self.app = create_app("testing")
        self.app_context = self.app.app_context()
        self.app_context.push()
        self.client = self.app.test_client(use_cookies = True)

    
    def tearDown(self):
        self.app_context.pop()


    def test_for_sending_get_request(self, mock_request):
        mock_request.return_value.json.return_value = json.dumps([])
        response = self.client.get(url_for("data.load"))
        mock_request.assert_called_with(method="GET", url=ANY,
            params=ANY, data=ANY, headers=ANY)

    def test_for_passing_id_and_api_key(self, mock_request):
        mock_request.return_value.json.return_value = json.dumps([])
        response = self.client.get(url_for("data.load"))
        params = {
            "id": current_app.config.get("DATA_ID"),
            "apikey": current_app.config.get("DATA_API_KEY")
        }
        mock_request.assert_called_with(method=ANY, url=ANY, 
            params=params, data=ANY, headers=ANY)

    def test_for_using_proper_url(self, mock_request):
        mock_request.return_value.json.return_value = json.dumps([])
        response = self.client.get(url_for("data.load"))
        mock_request.assert_called_with(method=ANY, 
            url=current_app.config.get("DATA_URL"), 
            params=ANY, data=ANY, headers=ANY)
 
    def test_for_returning_proper_response(self, mock_request):
        test_response = json.dumps({"result":[
            {
                "Status":"RUNNING","FirstLine":"11 ",
                "Lon":20.9232426,"Lines":"11             ",
                "Time":"2016-10-11T23:44:44","Lat":52.2597351,
                "LowFloor":True,"Brigade":"2   "
            },
            {
                "Status":"RUNNING","FirstLine":"11 ","Lon":20.9117661,
                "Lines":"11             ","Time":"2016-10-11T23:44:46",
                "Lat":52.246067,"LowFloor":True,"Brigade":"013 "
            }
        ]})

        mock_request.return_value.json.return_value = test_response
        response = self.client.get(url_for("data.load"))
        self.assertEqual(response.get_data(as_text=True), test_response)