import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { GlobalService } from '../global.service';
import { CityService } from '../city.service';

@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {



  customColors = [
    { name: "9 am", value: "#eb5181" },
    { name: "12 pm", value: "#eb5181" },
    { name: "15 pm", value: "#eb5181" },
    { name: "18 pm", value:  "#eb5181"},
    { name: "21 pm", value: "#eb5181" },
    { name: "0 am", value: "#eb5181" },
    { name: "3 am", value: "#eb5181" },
    { name: "6 am", value: "#eb5181" },
    { name: "Temperature", value: "#eb5181" },
    { name: "Pressure", value: "#4350af" },
    { name: "Humidity", value: "#4350af" },
    { name: "Wind Speed", value: "#4350af" },
    { name: "Wind Direction", value: "#4350af" },
];

  

  constructor(public userService:UserService,public globalService : GlobalService, public cityService : CityService) { 
    this.userService.showMenu = true;
  }

  ngOnInit(): void {
    if(!this.cityService.selectedCity){
      this.cityService.getCurrentCity();
    }
  }

}
