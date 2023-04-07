from flask import Flask
from flask_pymongo import PyMongo

app = Flask(__name__)
app.secret_key = "secret key"
app.config["MONGO_URI"] = "mongodb+srv://amine:20153033@cluster0.nlmbg9v.mongodb.net/projetds?retryWrites=true&w=majority"
app.config["MONGO_URI"] = "mongodb://database:27017/weather"
mongo = PyMongo(app)


