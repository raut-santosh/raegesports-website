import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { HelperService } from 'src/app/services';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: any = {};

  constructor(private authService: AuthService, private router: Router, private helperService:HelperService){}

  formSubmit(event:any){
    this.authService.login(this.model).subscribe(
      (response) => {
        console.log(response)
        if(response.data.access_token){
          this.helperService.setCurrentUser();
          Swal.fire({
            icon: 'success',
            title: 'Login successful',
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
          });
          setTimeout(() => {
            this.router.navigate(['/auth/profile'])
          }, 3000);
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
