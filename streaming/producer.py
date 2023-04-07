import time
import json
from uuid import uuid4
from weather import weather_data,weather_forecast
from confluent_kafka import Producer
from read_conf import read_ccloud_config

kafka_topic_data = "topic_0"
kafka_topic_forecast = "topic_1"

def delivery_report(errmsg, msg):
 
	if errmsg is not None:
		print("Delivery failed for Message: {} : {}".format(msg.key(), errmsg))
		return
	print('Message: {} successfully produced to Topic: {} Partition: [{}] at offset {}'.format(
		msg.key(), msg.topic(), msg.partition(), msg.offset()))

def produce_data(geo):

	print("Starting Kafka Producer")

	json_data = json.dumps(weather_data(geo))

	print("connecting to Kafka topic...")

	producer = Producer(read_ccloud_config("client.properties"))

	print("data in producer")

	producer.poll(0)

	try:
		
		producer.produce(topic=kafka_topic_data, key=str(uuid4()), value=json_data, on_delivery=delivery_report)

		producer.flush()
		
	except Exception as ex:

		print("Exception happened :",ex)
		
	print("\n Stopping Kafka Producer")

def produce_forecast(geo):

	print("Starting Kafka Producer")

	json_forecast = json.dumps(weather_forecast(geo))

	print("connecting to Kafka topic...")

	producer = Producer(read_ccloud_config("client.properties"))

	print("data in producer")

	producer.poll(0)

	try:
		
		producer.produce(topic=kafka_topic_forecast, key=str(uuid4()), value=json_forecast, on_delivery=delivery_report)

		producer.flush()
		
	except Exception as ex:

		print("Exception happened :",ex)
		
	print("\n Stopping Kafka Producer")

"""
if __name__ == '__main__':
	geo = []
	geo.append("44.34")
	geo.append("10.99")
	produce_forecast(geo)
"""