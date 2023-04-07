import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, startWith , map} from 'rxjs';
import { CityService } from '../city.service';
import { City } from '../Classes/City';
import { UserService } from '../user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  cities : City[] = [];

  constructor(public userService:UserService, public cityService:CityService, public router:Router) { }

  autocompleteCities($event : any) {
    let input : string = $event.target.value;
    if(input != ""){
      this.cityService._searchCity(input).subscribe((data : any) => {
        this.cities = [];
        for(let d of data){
          this.cities.push(new City({
            name : d.display_name,
            country : d.address.country,
            lat : d.lat,
            lon : d.lon
          }));
        }
      }
    );    
    }else{
      this.cities = [];
    }
  };

  citySelected(city : City){
    //this.cityService.searchedCity.next(city);
    this.cityService.searchedCities.push(city);
    this.router.navigate(['Map']);
  }
  ngOnInit(): void {
  }

}
