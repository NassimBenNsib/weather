import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, concat } from 'rxjs';
import { Observable } from 'rxjs';
import { City } from './Classes/City';
import maplibregl,{GeolocateControl} from 'maplibre-gl';
import { GlobalService } from './global.service';
import { User } from './Classes/User';
import { UserService } from './user.service';
import { tap, catchError, concatMap, map } from 'rxjs/operators';
import { forkJoin, of, from } from 'rxjs';



@Injectable({
  providedIn: 'root'
})
export class CityService implements OnInit {

  selectedCity : City | undefined;
  selectedDate : Date = new Date();
  currentDate : Date = new Date();
  selectedCityForecast : any;
  maxTemp : number = 0;
  minTemp : number = 0;
  currentCity : City |undefined;
  currentCityForecast : any
  timeoutId : any = null;

  chanceOfRain : any[] = [];
  temp : any[] = [
  {"name": "Temperature","series" : []},
];

pressure : any[] = [
  {"name": "Pressure","series" : []},
];

humidity : any[] = [
  {"name": "Humidity","series" : []},
];

speed : any[] = [
  {"name": "Wind Speed","series" : []},
];

deg : any[] = [
  {"name": "Wind Direction","series" : []}
];

  days = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  forecastDays : any = [];

  followedCities : City[] = [];

  constructor(private http : HttpClient, public globalService : GlobalService, public userService: UserService) { }

  ngOnInit(): void {}

  searchedCity = new BehaviorSubject<City | undefined>(undefined);
  searchedCities : City[] = [];
  
  numberOfAutocomple : number = 2;

  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _searchCity(cityName : string){
    return this.http.get<City>(`https://nominatim.openstreetmap.org/search/${cityName}?format=json&addressdetails=1&limit=${this.numberOfAutocomple}`);
  }

  _getCityWeather(lat : number,lon : number){
    return this.http.get<City>(`http://localhost:2018/weather/${lat}/${lon}`);
  }

  _getCityForecast(lat : number,lon : number){
    return this.http.get<any>(`http://localhost:2018/forecast/${lat}/${lon}`);
  }

  async _getFollowedCities(){
    let cities = this.userService.user?.villes!;
    
    /*let httpCalls : any[] = [];
    for(let city of cities){
      httpCalls.push(this._getCityWeather(city.lat, city.lon));
    }
    let multicall = forkJoin(httpCalls);
    multicall.subscribe(results => { 
    console.log(results);
    });*/

    for(let i = 0; i < cities.length ; i++){
      this._getCityWeather(cities[i].lat, cities[i].lon).subscribe((data : any)=>{
        let city : City = new City({
        name : data.City,
        lat : data.Corrd.lat,
        lon : data.Corrd.lon,
        country : data.Country,
        humidity : data.Humidity,
        temp : data.Temp,
        windDirection : data.Wind_Dir,
        windSpeed : data.Wind_Speed,
        pressure : data.Pressure
      });
      this._getCityImage(city).subscribe((data1)=>{
        city.image = data1["photos"][0]["src"]["large"];
        this.followedCities.push(city);
      })
      });
      await this.delay(10000);
    }
  }

  _getCityDate(lat : number,lon : number){
    return this.http.get<any>(`https://api.api-ninjas.com/v1/worldtime?lat=${lat}&lon=${lon}`,{headers : {
      "x-api-key" : "fmjDaOP1c1d3sLyIh+dkyw==kVVXalSoAIefHlm0"
    }})
  }

  cityExist(user : User, city : City){
    let exist = false;
    for(let c of user.villes){
      if(c.ville = city.name){
        exist = true;
        break;
      }
    }
    return exist;
  }

  _addCity(user : User, city : City){
    return this.http.put<any>(`http://localhost:2018/user/ville/add`,{
      "_id" : user._id,
      "ville" : city.name,
      "pay" : city.country,
      "lon" : city.lon,
      "lat" : city.lat
    });
  }

  _getCityImage(city : City){
    return this.http.get<any>(`https://api.pexels.com/v1/search?query=${city.name} - ${city.country} Landmark Horizontal&per_page=1`,{headers : {
      "Authorization" : "4xadNkf603ll4Wug2RCpUJd0j9GL4XslFsysCvCae8lAhnGpUpcr79QR"
    }})
  }

  _deleteFollowedCity(city : String){
    console.log(this.userService.user);
    return this.http.delete<any>(`http://localhost:2018/user/ville/delete/${this.userService.user?._id["$oid"]}/${city}`);
  }

  getCurrentDate(lat : number, lon : number){
    this._getCityForecast(lat, lon).subscribe((data:any)=>{
      //this.selectedDate = new Date(Date.parse(data.dateTime));
      console.log(this.selectedCity);
      console.log(data);
    });
  }


  getCurrentCity(){
    if(this.selectedCity == undefined){
      navigator.geolocation.getCurrentPosition((position) => {
        this.getCity(position.coords.latitude, position.coords.longitude,true);
      });
    }
  }

  cityWeatherIcon(date : any){
    let rainyHours : number = 0;
    let forecast : any = Object.values(this.selectedCityForecast);
    for(let day of forecast){
      if(new Date(Date.parse(day.dt_txt)).getDate() == date){
        console.log(day.pop);
        if(day.pop > 0.3){
          rainyHours++;
        }
      }
    }

    if(rainyHours < 2){
      return "../../assets/Img/SunnyIcon.svg";
    }else if(rainyHours < 3){
      return "../../assets/Img/RainyIcon.svg";
    }else{
      return "../../assets/Img/HeavyRainIcon.svg";
    }
  }

  cityWeatherStatus(date : any){
    let rainyHours : number = 0;
    let forecast : any = Object.values(this.selectedCityForecast);
    for(let day of forecast){
      if(new Date(Date.parse(day.dt_txt)).getDate() == date){
        if(day.pop > 30){
          rainyHours++;
        }
      }
    }

    if(rainyHours < 2){
      return "Sunny";
    }else if(rainyHours < 3){
      return "Rainy";
    }else{
      return "Heavy Rain";
    }
  }

  async getCity(lat : number, lon : number, currentCity? : Boolean){
    this._getCityWeather(lat, lon).subscribe((data:any)=>{
      this.selectedCity = new City({
        name : data.City,
        lat : data.Corrd.lat,
        lon : data.Corrd.lon,
        country : data.Country,
        humidity : data.Humidity,
        temp : data.Temp,
        windDirection : data.Wind_Dir,
        windSpeed : data.Wind_Speed,
        pressure : data.Pressure
      })
      this._getCityImage(this.selectedCity).subscribe((data1)=>{
        this.selectedCity!.image = data1["photos"][0]["src"]["large"];
        if(currentCity){
          this.currentCity = this.selectedCity;
        }
      })
    });
    this._getCityDate(lat,lon).subscribe((data:any)=>{
      this.selectedDate, this.currentDate = new Date(Date.parse(data.datetime));
      this._getCityForecast(lat,lon).subscribe((data:any)=>{
        this.selectedCityForecast = data;
        if(currentCity){
          this.currentCityForecast = this.selectedCityForecast;
        }
        this.refreshForecast();
      });
    });
  }

  checkDayExist(date : Date){
    for(let i = 0; i < this.forecastDays.length; i++){
      if(this.forecastDays[i]["date"].getDate() == date.getDate())
      return i;
    }
    return -1;
  }

  refreshForecast(){
      this.chanceOfRain = [];
      this.temp = [
        {"name": "Temperature","series" : []},
      ];
      this.pressure = [
        {"name": "Pressure","series" : []},
      ];
      this.humidity = [
        {"name": "Humidity","series" : []},
      ];
      this.speed = [
        {"name": "Wind Speed","series" : []},
      ];
      this.deg = [
        {"name": "Wind Direction","series" : []},
      ];
      this.forecastDays = [];
      this.minTemp, this.maxTemp = Math.round(this.selectedCityForecast[`${0}`].temp - 273.15);
      for(let i = 0;`${i}`in this.selectedCityForecast; i++){
        let date : Date = new Date(Date.parse(this.selectedCityForecast[`${i}`].dt_txt));
        let temp : number = Math.round(this.selectedCityForecast[`${i}`].temp - 273.15);
        if(this.checkDayExist(date) == -1 && this.forecastDays.length < 5){
          this.forecastDays.push({"date" : date,"minTemp" : temp, "maxTemp" : temp});
        }
        let index = this.checkDayExist(date);
        console.log(index)
        if(index < 5 && index >= 0){
          if(temp > this.forecastDays[index].maxTemp)
          this.forecastDays[index].maxTemp = temp
  
          if(temp < this.forecastDays[index].minTemp)
          this.forecastDays[index].minTemp = temp
        }
        if(date.getDate() == this.selectedDate?.getDate()){
          this.chanceOfRain.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : this.selectedCityForecast[`${i}`].pop * 100});
          this.temp[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].temp - 273.15)});
          this.pressure[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].pressure)});
          this.humidity[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].humidity)});
          this.speed[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].speed)});
          this.deg[0].series.push({"name" : date.getHours().toString().length > 1 ? date.getHours().toString() + " pm" : date.getHours().toString() + " am" , "value" : Math.round(this.selectedCityForecast[`${i}`].deg)});
        }
      }
  }
}
