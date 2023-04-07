import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { CityService } from '../city.service';
import { GlobalService } from '../global.service';
import { City } from '../Classes/City';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cities',
  templateUrl: './cities.component.html',
  styleUrls: ['./cities.component.css']
})
export class CitiesComponent implements OnInit {

  constructor(public userService:UserService, public cityService : CityService, public router:Router,public globalService : GlobalService) { 
    this.userService.showMenu = true;
  }

  selectCity(city:City){
    this.cityService.getCity(city.lat!,city.lon!);
    this.router.navigate(['Home']);
  }

  deleteFollowedCity(city:String){
    this.cityService._deleteFollowedCity(city).subscribe((data)=>{
      this.cityService.followedCities = [];
      this.userService._refreshUser();
      this.globalService.openSuccessSnackBar(`You have unfollowed ${city}`);
    },(error)=>{
      this.globalService.openErrorSnackBar(`An error has occured, try again later`);
    })
  }

  ngOnInit(){
    if(!this.cityService.currentCity){
      //this.cityService.getCurrentCity();
    }
    if(this.cityService.followedCities.length == 0){
      this.cityService._getFollowedCities();
    }
  }

}
