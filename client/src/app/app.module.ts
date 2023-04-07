import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuComponent } from './menu/menu.component';
import {MatIconModule} from '@angular/material/icon';
import {MatRippleModule} from '@angular/material/core';
import { LoginComponent } from './login/login.component';
import {MatButtonModule} from '@angular/material/button';
import { SignUpComponent } from './sign-up/sign-up.component';
import { HeaderComponent } from './header/header.component';
import { SettingsComponent } from './settings/settings.component';
import { HomeComponent } from './home/home.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { ForecastComponent } from './forecast/forecast.component';
import { MapComponent } from './map/map.component';
import { CitiesComponent } from './cities/cities.component';
import { NgxMapLibreGLModule } from '@maplibre/ngx-maplibre-gl';
import { HttpClientModule } from '@angular/common/http';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FormsModule} from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';



@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    LoginComponent,
    SignUpComponent,
    HeaderComponent,
    SettingsComponent,
    HomeComponent,
    ForecastComponent,
    MapComponent,
    CitiesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatIconModule,
    MatRippleModule,
    MatButtonModule,
    MatBadgeModule,
    MatMenuModule,
    MatSlideToggleModule,
    NgxMapLibreGLModule,
    HttpClientModule,
    MatAutocompleteModule,
    FormsModule,
    MatSnackBarModule,
    NgxChartsModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


