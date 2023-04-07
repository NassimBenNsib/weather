import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CityService } from '../city.service';
import { UserService } from '../user.service';
import maplibregl,{Map,NavigationControl ,Marker, GeolocateControl, FullscreenControl, MapMouseEvent, Popup} from 'maplibre-gl';
import { City } from '../Classes/City';
import { GlobalService } from '../global.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  loading : Boolean = false;
  selectedCity : City | undefined;
  constructor(public userService:UserService, public cityService : CityService, public globalService: GlobalService, public router:Router) { 
    this.userService.showMenu = true;
    this.cityService.searchedCity.subscribe(() => {
      this.addSearchedCity();
  });
  }


  selectCity(city:City){
    this.loading = true;
    this.selectedCity = new City({});
    this.selectedCity!.lat = city.lat;
    this.selectedCity!.lon = city.lon; 
    this.cityService._getCityWeather(city.lat!, city.lon!).subscribe((data : any)=>{
      this.loading = false;
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
    });
  }



  //@ViewChild(`map`) map1: Map1 | undefined;
  @ViewChild(`map`) mapContainer!: ElementRef<HTMLElement>;
  @ViewChild(`cityDetails`) cityDetails!: ElementRef<HTMLElement>;
  map!: Map;
  initialState = { lng: 139.753, lat: 35.6844, zoom: 0 };
  


  initMap(){
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `https://api.maptiler.com/maps/streets/style.json?key=TQUed2PX6IF7nMlESPX8`,
      center: [this.initialState.lng, this.initialState.lat],
      zoom: this.initialState.zoom
    });

    this.addSearchedCity();

    this.map.addControl(new FullscreenControl({}), 'top-right');
    this.map.addControl(new NavigationControl({}), 'top-right');
    this.map.addControl(new GeolocateControl({}), 'top-right');

    this.addFollowedCities();
  }

  public async addSearchedCity(){
    let city = this.cityService.searchedCity.getValue();
    let popup!: Popup;
    let marker! : Marker;
    if(city != undefined){


      popup = new Popup({closeButton : false, closeOnClick : true})
      .setDOMContent(this.cityDetails.nativeElement)


      marker = new Marker({color: "rgb(235, 81, 129)"})
      .setLngLat([city?.lon!,city?.lat!])
      .setPopup(popup)
      .addTo(this.map)


      marker.getElement().addEventListener('click', () => {
        this.loading = true;
        this.cityService._getCityWeather(city?.lat!, city?.lon!).subscribe((data : any)=>{
          this.loading = false;
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
        })
      });
  
      this.map.flyTo({
        center: [
          city.lon!,
          city.lat!
        ],
        zoom : 10,
        essential: true // this animation is considered essential with respect to prefers-reduced-motion
        });
    }
  }

  addFollowedCities(){
    for(let city of this.userService.user?.villes!){
      let popup!: Popup;
      let marker! : Marker;
      if(city != undefined){
  
  
        popup = new Popup({closeButton : false, closeOnClick : true})
        .setDOMContent(this.cityDetails.nativeElement)

        marker = new Marker({color: "rgb(67,80,175)"})
        .setLngLat([city?.lon!,city?.lat!])
        .setPopup(popup)
        .addTo(this.map)

        marker.getElement().addEventListener('click', () => {
          this.loading = true;
          this.cityService._getCityWeather(city?.lat!, city?.lon!).subscribe((data : any)=>{
            this.loading = false;
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
          })
        });
    }
  }
  }
  addCity(){
    if(this.userService.user){
      if(this.selectedCity){
        if(!this.cityService.cityExist(this.userService.user, this.selectedCity)){
          this.cityService._addCity(this.userService.user, this.selectedCity).subscribe((data : any)=>{
            this.userService._refreshUser();
            this.cityService.followedCities = [];
            this.globalService.openSuccessSnackBar("You are now following this city");
          }, (error : any)=>{
            this.globalService.openErrorSnackBar("An error occured while following city, try again later");
          })
        }else{
          this.globalService.openErrorSnackBar("You are already following this city");
        }
      }
    }else{
      this.globalService.openErrorSnackBar("Login to your account to follow cities");
      this.router.navigate(['Login']);
    }
  }

  ngAfterViewInit() : void{
    this.initMap();
  }

  ngOnInit(): void {
    /*maplibregl.setRTLTextPlugin(
      'https://unpkg.com/@mapbox/mapbox-gl-rtl-text@0.2.3/mapbox-gl-rtl-text.min.js',
      ()=>{},
      true// Lazy load the plugin
      );*/
      if(this.userService.isUserLogged && this.cityService.searchedCities.length == 0){
        console.log(this.userService.user);
        if(this.userService.user!.villes!.length != 0){
          console.log("hII");
          this.selectCity(this.userService.user!.villes![0]);
        }
      }else if(this.cityService.searchedCities.length > 0){
        this.selectCity(this.cityService.searchedCities[0]);
      }
  }

}
