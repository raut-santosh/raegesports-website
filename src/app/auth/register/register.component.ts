import { Component } from '@angular/core';
import { AuthService, HelperService } from 'src/app/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  constructor(private authService: AuthService, private helperService:HelperService, private router:Router){}

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
        this.router.navigate(['/'])
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

}
