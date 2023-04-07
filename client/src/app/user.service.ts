import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators'; 
import { City } from './Classes/City';
import { User } from './Classes/User';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(public router:Router, private http : HttpClient) {
    if(localStorage.getItem('user') != null){
      this.user = JSON.parse(localStorage.getItem('user')!);
      this.isUserLogged = true;
    }else{
      this.isUserLogged = false;
      this.user = undefined;
    }
   }

  isUserLogged = false;
  user : User | undefined = undefined;
  showMenu = false;

  _logout(){
    this.isUserLogged = false;
    localStorage.removeItem('user');
    this.user = undefined;
    this.router.navigate(['Login']);
  }

  _login(user : User) : Observable<User>{
    return this.http.post<User>(`http://localhost:2018/login`,user)
  }

  _signUp(user : User) : Observable<any>{
    return this.http.post<User>(`http://localhost:2018/users/add`,user)
  }

  _getUser(user : User) : Observable<any>{
    return this.http.get<User>(`http://localhost:2018/user/${user._id["$oid"]}`)
  }

  _refreshUser(){
    if(this.user){
      console.log(this.user);
      this._getUser(this.user).subscribe((data:User)=>{
        this.user = data;
        localStorage.removeItem('user');
        localStorage.setItem('user',JSON.stringify(this.user));

        console.log(this.user);
      })
    }
  }

  _update(user : User) : Observable<any>{
    return this.http.put<User>(`http://localhost:2018/user/update`,user)
  }
}
