import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: any = {};

  constructor(public authService: AuthService, private router: Router){}

  formSubmit(event:any){
    this.authService.login(this.model).subscribe(
      (response) => {
        console.log(response)
        if(response){
          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
          });
            this.router.navigate(['/auth/profile'])
        }
      },
      (error) => {
        console.log(error)
        Swal.fire({
          icon: 'error',
          title: error.code,
          text: 'error while login',
          showConfirmButton: false, // Remove the "OK" button
          timer: 2000 
        })
      }
    )
  }

 


  
}
