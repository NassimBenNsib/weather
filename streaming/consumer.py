from confluent_kafka import Consumer,TopicPartition,KafkaError
import time
from datetime import datetime
from ast import literal_eval
import json
import functools
import pandas as pd
from read_conf import read_ccloud_config





def consume_data():

    print("Starting Kafka Consumer")
    print("connecting to Kafka topic")
    props = read_ccloud_config("client.properties")

    props["group.id"] = "python-group-1"

    props["auto.offset.reset"] = "latest"
    consumer = Consumer(props)
    kafka_topic_data = "topic_0"
    topicparts_data = TopicPartition(kafka_topic_data, 0)
    low_d, high_d = consumer.get_watermark_offsets(topicparts_data)
    topicparts_data.offset = high_d-1
    consumer.assign([topicparts_data])

    consumer.subscribe(["topic_0"])
    msg = consumer.poll(1.0)

    if msg is None:
            print("Consumer None" )
            msg =msg
    if msg :
        if msg.error():
            print("Consumer error happened: {}".format(msg.error()))
            msg =msg
        else:
            print("Received Message :",msg.value().decode('utf-8'))
            msg =msg.value().decode('utf-8')

    print("consumer ended")

    return traitD(msg)



def consume_forecast():

    print("Starting Kafka Consumer")
    print("connecting to Kafka topic")
    props = read_ccloud_config("client.properties")

    props["group.id"] = "python-group-1"

    props["auto.offset.reset"] = "latest"
    consumer = Consumer(props)
    kafka_topic_forecast = "topic_1"
    topicparts_forecast = TopicPartition(kafka_topic_forecast, 0)
    low_f, high_f = consumer.get_watermark_offsets(topicparts_forecast)
    topicparts_forecast.offset = high_f-1

    consumer.assign([topicparts_forecast])

    consumer.subscribe(["topic_1"])

    msg = consumer.poll(1.0)

    if msg is None:
            print("Consumer None" )
            msg =msg
    if msg :
        if msg.error():
            print("Consumer error happened: {}".format(msg.error()))
            msg =msg
        else:
           
            msg =msg.value().decode('utf-8')
            print("Received Message :")
            
    
    return traitF(msg)

def traitF(message):
     
     data=json.loads(message)

     city = pd.json_normalize(data["city"])

     list_main = pd.DataFrame(data['list']).loc[:,"main"]
    
     list_wind = pd.DataFrame(data['list']).loc[:,"wind"]

     list_dt = pd.DataFrame(data['list']).loc[:,"dt_txt"]
 
     listM = pd.json_normalize(list_main)
 
     listTHP = listM[["temp","humidity","pressure"]]

     listW = pd.json_normalize(list_wind)

     listDS = listW[["deg","speed"]]

     list_PoP = pd.DataFrame(data['list']).loc[:,"pop"]

     #list_Rain = pd.DataFrame(data['list']).loc[:,"rain"]
     
     complete_df = pd.concat([list_dt, listTHP,listDS,list_PoP], axis=1)

     dataF={
          "Corrd":{
            "lat": city["coord.lat"][0],
            "lon": city["coord.lon"][0]
        },
        'City':city['name'][0],
        'Country':city['country'][0]
       
     }
     
     dctF=json.loads(complete_df.to_json(orient = 'index'))

     combined_dct = dataF | dctF

     weather_forecast_s =  json.dumps(combined_dct)

     return weather_forecast_s


def traitD(message):
    
    message=json.loads(message)

    coord = pd.DataFrame({'Coord':message["coord"]})

    waether = pd.DataFrame(message["weather"])

    base = pd.DataFrame({'Base':[message["base"]]})

    main = pd.DataFrame({'Main':message["main"]})

    coord = pd.DataFrame({'Coord':message["coord"]})

    visibility = pd.DataFrame({'Visibility':[message["visibility"]]})

    wind = pd.DataFrame({'Wind':message["wind"]})

    clouds = pd.DataFrame({'Clouds':message["clouds"]})

    dt = pd.DataFrame({'dt':[message["dt"]]})

    sys = pd.DataFrame({'Sys':message["sys"]})

    timezone = pd.DataFrame({'Timezone':[message["timezone"]]})

    id = pd.DataFrame({'ID':[message["id"]]})

    name = pd.DataFrame({'Name':[message["name"]]})

    cod = pd.DataFrame({'Cod':[message["name"]]})

    weather_data={
        "Corrd":{
            "lon": coord.loc['lon','Coord'],
            "lat": coord.loc['lat','Coord']
        },
        "Country":sys.loc['country','Sys'],
        'City':name.loc[0,'Name'],
        'Temp':round(main.loc['temp','Main']- 273.15, 2) ,
        'Humidity':main.loc['humidity','Main'],
        'Pressure':main.loc['pressure','Main'],
        'Wind_Dir':wind.loc['deg','Wind'],
        'Wind_Speed':wind.loc['speed','Wind']
    }
    # convert into JSON:
    weather_data_s = json.dumps(weather_data)
    return weather_data_s
""" 
if __name__ == '__main__':
     consume_forecast()
"""