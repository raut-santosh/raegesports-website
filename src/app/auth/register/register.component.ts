import { Component } from '@angular/core';
import { AuthService, HelperService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  otp: any;
  isVerified: boolean = false;
  otpSent: boolean = false;
  countdown: number = 120; // Initial countdown value in seconds
  private timerId: any;
  constructor(private authService: AuthService, private helperService:HelperService, private router:Router, private apiService:ApiService){}

  formSubmit(event:any){
    if(this.isVerified){
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
    }else{
      Swal.fire({
        icon: 'error',
        title: "Invalid Otp",
        text: 'Please verify otp first',
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 
      })
    }
    
  }

  sendOtp(){


    this.otp = Math.floor(1000 + Math.random() * 9000).toString();
    this.countdown = 120; 

    const payload = {
      email: this.model.email,
      subject: "Otp for registration",
      message: `Here is your 4 digit otp ${this.otp}`,
      type: 'otp'
    }
    this.apiService.callApi('my-api/sendmail', 'post', payload).subscribe(
      (response) => {
        if(response.success){
          this.otpSent = true;
          this.startTimer();
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Email already exists',
            text: response.message,
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 
          })
        }
      },
      (error) => {
        console.log(error)
      }
    )
  }

  private startTimer() {
    this.timerId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearTimer();
        this.otpSent = false;
        // Handle timer expiration, e.g., disable UI or show a message
      }
    }, 1000); // Update every 1 second
  }



  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  // Implement OnDestroy interface to handle component destruction
  ngOnDestroy() {
    // Clear the timer when the component is destroyed
    this.clearTimer();
  }

  verifyOtp(){
    if(this.model.otp === parseInt(this.otp)){
      Swal.fire({
        icon: 'success',
        title: "Otp Verified",
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 
      })
      this.isVerified = true;
    }else{
      Swal.fire({
        icon: 'error',
        title: "Invalid Otp",
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 
      })
      this.isVerified = false;
    }
  }
  

  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

}

