from json import loads
import requests

from app import app, mongo
from bson.json_util import dumps
from bson.objectid import ObjectId
from flask_cors import CORS 
from flask import jsonify, flash, request, Flask,abort
from werkzeug.security import generate_password_hash, check_password_hash
from User import User

import smtplib
import ssl
from email.message import EmailMessage

email_sender = 'sniper101k@gmail.com'
email_password = 'xdpjxoizsfrhcoiw'
email_receiver = 'maminekaabi@gmail.com'
subject = 'Weather Alert'

em = EmailMessage()
em['From'] = email_sender
em['Subject'] = subject


app = Flask(__name__)
CORS(app)


def setNotification(x):
	em['To'] = x['email']
	_id=x['_id']
	filter={'_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)}
	mongo.db.user.update_one(filter, {'$pull':{ "notification": {} } })
	citylist=x['villes']
	
	for item in citylist:
		a=loads(requests.get('http://streaming:5000/mycitiesweather?lat='+str(item['lat'])+'&lon='+str(item['lon'])).text) 
		degr=a['main']['temp']
		if(degr>=200):
			prob="heatwave"

			body = "we Like to inform you that there is heatwave in "+item['ville']
			print(x['email'])
			#em['To'] = x['email']
			em.set_content(body)
			# Add SSL (layer of security)
			context = ssl.create_default_context()

			with smtplib.SMTP_SSL('smtp.gmail.com', 465, context=context) as smtp:
				smtp.login(email_sender, email_password)
				smtp.sendmail(email_sender, email_receiver, em.as_string())
				print('in')
			#user = mongo.db.user.find_one({'_id':_id},{'notification':{'ville':item['ville']}})
			#print(user)
			
			mongo.db.user.update_one(filter, {'$push':{ "notification": {"ville":item['ville'],"type":prob,"etat":True} } })
			
			
		

			

	
	    

@app.route('/testapi')
def testapi():
		return requests.get('http://streaming:5000/testapi').text


@app.route('/weather/<lat>/<lon>',methods=['GET'])
def weatherby(lat,lon):
	return requests.get('http://streaming:5000/weather/data?lat='+lat+'&lon='+lon).text

@app.route('/forecast/<lat>/<lon>',methods=['GET'])
def weatherforecast(lat,lon):
	return requests.get('http://streaming:5000/weather/forecast?lat='+lat+'&lon='+lon).text


@app.route('/login',methods=['POST'])
def log_in():
	_json = request.json
	_email = _json['email']
	_password = _json['pwd']
	user = mongo.db.user.find_one({'email': _email})

	res:User = loads(dumps(user))
	if res:
		x=check_password_hash(res["pwd"],_password)
		if x:
			setNotification(res)
			return res
	return abort(404,"Email or password incorrect")
	



@app.route('/users',methods=['GET'])
def users():
	users = mongo.db.user.find()
	resp = dumps(users)
	print(resp)
	return resp

@app.route('/users/add',methods=['POST'])
def add_user():
	print("test1")
	_json = request.json
	_nom = _json['nom']
	_prenom = _json['prenom']
	_email = _json['email']
	_password = _json['pwd']
	if _nom and _prenom and _email and _password and request.method == 'POST':
		_hashed_password = generate_password_hash(_password)
		id = mongo.db.user.insert_one({'nom': _nom,'prenom': _prenom, 'email': _email, 'pwd': _hashed_password,'villes' : []})
		resp = jsonify('User added successfully!')
		resp.status_code = 200
		return resp
	else:
		return abort(500,"An error occured while creating user, try agin later")
		

		
@app.route('/user/<id>',methods=['GET'])
def user(id):
	user = mongo.db.user.find_one({'_id': ObjectId(id)})
	resp = dumps(user)

	return resp

@app.route('/user/update', methods=['PUT'])
def update_user():
	_json = request.json
	_id = _json['_id']
	_nom = _json['nom']
	_prenom = _json['prenom']
	_email = _json['email']
	#_password = _json['pwd']		

	if _nom and _prenom and _email and _id and request.method == 'PUT':
		#_hashed_password = generate_password_hash(_password)
		mongo.db.user.update_one({'_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)}, {'$set': {'nom': _nom,'prenom': _prenom, 'email': _email}})
		user = mongo.db.user.find_one({'_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)})
		resp = dumps(user)
		return resp
	else:
		return abort(500,"User update error")
		
@app.route('/user/delete/<id>', methods=['DELETE'])
def delete_user(id):
	mongo.db.user.delete_one({'_id': ObjectId(id)})
	resp = jsonify('User deleted successfully!')
	resp.status_code = 200
	return resp

@app.route('/user/ville/add', methods=['PUT'])
def add_ville():
	_json = request.json
	_id = _json['_id']
	_ville = _json['ville']
	_pay = _json['pay']
	_lon = _json['lon']
	_lat = _json['lat']


	if _ville and _pay and _lon and _lat and _id and request.method == 'PUT':
		ville={'ville': _ville,'pay': _pay, 'lon': _lon, 'lat': _lat}
		mongo.db.user.update_one({'_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)}, {'$push':{ "villes": ville } })
		resp = jsonify('City added successfully!')
		resp.status_code = 200
		return resp
	else:
		return abort(500,"An error occured while adding city, try again later")
	



@app.route('/user/ville/delete/<id>/<ville>', methods=['DELETE'])
def delete_ville(id,ville):
	_id = id
	villeobj={'ville': "xxxx",'pay': "xxx", 'lon': 123, 'lat': 123}
	print("ville:",ville)
	mongo.db.user.update_one({'_id': ObjectId(_id['$oid']) if '$oid' in _id else ObjectId(_id)}, {'$pull':{ "villes": {"ville": ville} } })


	resp = jsonify('City deleted successfully!')
	resp.status_code = 200
	return resp


#@app.errorhandler(404)
#def not_found(error=None):
#    message = {
#        'status': 404,
#        'message': 'Not Found: ' + request.url,
#    }
#    resp = jsonify(message)
#    resp.status_code = 404

#    return resp

if __name__ == "__main__":
	
    app.run(host="0.0.0.0",port=5000)
