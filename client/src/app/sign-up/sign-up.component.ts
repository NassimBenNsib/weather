import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../Classes/User';
import { GlobalService } from '../global.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  constructor(public userService:UserService, public globalService : GlobalService, public router:Router) { 
    this.userService.showMenu = false;
  }

  signUp(form:NgForm){
    this.userService._signUp(new User({
      prenom : form.value['Name'],
      nom : form.value['Lastname'],
      email : form.value['Email'],
      pwd : form.value['Password'] })).subscribe(()=>{
        this.globalService.openSuccessSnackBar(`Your account was created successfully`);
        this.router.navigate(['Login']);
    },(error)=>{
        this.globalService.openErrorSnackBar("An error has occured, your account was not created");
        console.log(error);
    })
  }

  ngOnInit(): void {
  }

}
