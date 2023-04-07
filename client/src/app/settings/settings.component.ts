import { AfterContentChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from '../Classes/User';
import { GlobalService } from '../global.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements AfterViewInit{

  @ViewChild(`form`) form: ElementRef | any;

  constructor(public userService:UserService, public globalService : GlobalService) { 
    this.userService.showMenu = true;
  }


  ngAfterViewInit() : void{
    setTimeout(() => this.reset(this.form?.form), 10);
  }

  update(form:NgForm){
    this.userService._update(new User({
      _id : this.userService.user?._id,
      prenom : form.value['Name'],
      nom : form.value['Lastname'], 
      email : form.value['Email'] 
    })).subscribe((data : User)=>{
      this.userService.user = data;
      localStorage.setItem('user',JSON.stringify(this.userService.user));
      this.globalService.openSuccessSnackBar(`Account details updated successfully`);
    },(error)=>{
      this.globalService.openErrorSnackBar("An error has occured");
    })
  }

  reset(form:NgForm){
    form.controls['Name'].setValue(this.userService.user?.prenom);
    form.controls['Lastname'].setValue(this.userService.user?.nom);
    form.controls['Email'].setValue(this.userService.user?.email);
  }

}
