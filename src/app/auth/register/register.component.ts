import { Component } from '@angular/core';
import { AuthService, HelperService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  otp: any;
  constructor(private authService: AuthService, private helperService:HelperService, private router:Router, private apiService:ApiService){}

  formSubmit(event:any){
    this.authService.register(this.model).subscribe(
     (response) => {
      console.log('registred', response)
      if(response.success){
        Swal.fire({
          icon: 'success',
          title: 'Registration successful',
          showConfirmButton: false, // Remove the "OK" button
          timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
        });
        this.router.navigate(['/auth/login'])
      }else{
        Swal.fire({
          icon: 'error',
          title: response.error.code,
          text: response.error.code == 'RECORD_NOT_UNIQUE' ? 'Email id already used' : response.message,
          showConfirmButton: false, // Remove the "OK" button
          timer: 2000 
        })
      }
     },
     (error) => {
      console.log(error)
      Swal.fire({
        icon: 'error',
        title: error.code,
        text: error.message,
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 
      })
     }
    )
  }

  sendOtp(){
    this.apiService.callApi('my-api/handleotp', 'post', this.model.otp).subscribe(
      (response) => {
        console.log(response)
      },
      (error) => {
        console.log(error)
      }
    )
  }


  

}

