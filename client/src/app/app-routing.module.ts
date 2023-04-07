import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CitiesComponent } from './cities/cities.component';
import { ForecastComponent } from './forecast/forecast.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { MapComponent } from './map/map.component';
import { SettingsComponent } from './settings/settings.component';
import { SignUpComponent } from './sign-up/sign-up.component';

const routes: Routes = [
  {path:'Login',component:LoginComponent},
  {path:'SignUp',component:SignUpComponent},
  {path:'Home',component:HomeComponent},
  {path:'Forecast',component:ForecastComponent},
  {path:'Map',component:MapComponent},
  {path:'Settings',component:SettingsComponent},
  {path:'Cities',component:CitiesComponent},
  {path: '',redirectTo: 'Home', pathMatch : 'full'},
  {path: '**',redirectTo: 'Login', pathMatch : 'full'}

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
