import { Injectable } from '@angular/core';
import { MatSnackBar,MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { City } from './Classes/City';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  
  snack_bar_horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  snack_bar_verticalPosition: MatSnackBarVerticalPosition = 'top';
  snack_bar_duration : number = 3;
  selectedCity : City | undefined;


  constructor(private _snackBar: MatSnackBar, private http : HttpClient) { }

  openErrorSnackBar(message : string) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.snack_bar_horizontalPosition,
      verticalPosition: this.snack_bar_verticalPosition,
      duration: this.snack_bar_duration * 1000,
      panelClass: ['errorSnackbar']
    });
  }

  openSuccessSnackBar(message : string) {
    this._snackBar.open(message, 'X', {
      horizontalPosition: this.snack_bar_horizontalPosition,
      verticalPosition: this.snack_bar_verticalPosition,
      duration: this.snack_bar_duration * 1000,
      panelClass: ['successSnackbar']
    });
  }
}
