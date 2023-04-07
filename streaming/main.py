from flask import Flask,jsonify, flash, request
from producer import produce_data,produce_forecast 
from consumer import consume_data,consume_forecast
import json
from DB_cnx import insert_weather
from weather import weather_data


app = Flask(__name__)


@app.route('/testapi')
def testapi():
	return "API Working"




@app.route('/weather/<type>',methods=['GET'])
async def WeatherData(type):
        geo = []
        lat  = request.args.get('lat', type=str ,default='')
        lon  = request.args.get('lon',type=str , default='')
        geo.append(lat)
        geo.append(lon)
        print("type",type)
        if(type == "data"):
            produce_data(geo)
            obj= consume_data()

        if(type == "forecast"):
            produce_forecast(geo)
            obj= consume_forecast()
        return obj

@app.route('/mycitiesweather')
def citiesweathercheck():
    geo = [] 
    lat  = request.args.get('lat', type=str ,default='')
    lon  = request.args.get('lon',type=str , default='')
    geo.append(lat)
    geo.append(lon)
    return weather_data(geo)

@app.errorhandler(404)
def not_found(error=None):
    message = {
        'status': 404,
        'message': 'Not Found: ' + request.url,
    }
    resp = jsonify(message)
    resp.status_code = 404

    return resp

if __name__ == "__main__":
    app.run(host="0.0.0.0",port=5000)