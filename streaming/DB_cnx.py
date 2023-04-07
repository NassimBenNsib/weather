import requests
from pymongo import MongoClient
 

client = MongoClient('localhost:27017')  # initialization of client server

db = client["weather3"]  
collection = db["weather_filtered"]
collection2 = db["weather"]
 
 
def insert_weather(city_weather):
    try:
        # city_weather = [data]
        collection.insert_one(city_weather)      
        print('\nInserted data successfully\n')

    except Exception as e:
        print(str(e))
 