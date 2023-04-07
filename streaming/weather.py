import requests
def weather_data(geo):
    BASE_URL = "https://api.openweathermap.org/data/2.5/weather?"
    API_KEY = "5b6a11d91f07a971991c6f783831b79f"
    URL = BASE_URL + "lat=" + geo[0]+"&lon="+geo[1]+ "&appid=" + API_KEY
    print("URL", URL)
    response = requests.get(URL)
    data = None
    if response.status_code == 200:
        data = response.json()
        print("dataaaa",data)
    return data

def weather_forecast(geo):
    BASE_URL = "https://api.openweathermap.org/data/2.5/forecast?"
    API_KEY = "5b6a11d91f07a971991c6f783831b79f"
    URL = BASE_URL + "lat=" + geo[0]+"&lon="+geo[1]+ "&appid=" + API_KEY
    print("URL", URL)
    response = requests.get(URL)
    data = None
    if response.status_code == 200:
        data = response.json()
    return data