import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../Classes/User';
import { GlobalService } from '../global.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(public userService:UserService, public globalService : GlobalService, public router:Router) { 
    this.userService.showMenu = false;
  }

  login(form:NgForm){
    this.userService._login(new User({email : form.value['Email'], pwd : form.value['Password'] })).subscribe((data : User)=>{
      this.userService.user = data;
      localStorage.setItem('user',JSON.stringify(this.userService.user));
      this.userService.isUserLogged = true;
      this.globalService.openSuccessSnackBar(`Welcome ${this.userService.user.nom} ${this.userService.user.prenom}`);
      this.router.navigate(['Home']);
      console.log(this.userService.user);
    },(error)=>{
      if(error.status == 404)
        this.globalService.openErrorSnackBar("Email or password is incorrect");
      else
        this.globalService.openErrorSnackBar("An error has occured");
    })
  }


  ngOnInit(): void {
  }

}
