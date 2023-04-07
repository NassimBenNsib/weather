import { Component, OnInit } from '@angular/core';
import { CityService } from '../city.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {


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


public colorScheme = "#eb5181"

  constructor(public userSerivce:UserService, public cityService:CityService) { 
    this.userSerivce.showMenu = true;
  }

  ngOnInit(): void {
    if(this.cityService.selectedCity == undefined){
      this.cityService.getCurrentCity();
    }
  }

}
