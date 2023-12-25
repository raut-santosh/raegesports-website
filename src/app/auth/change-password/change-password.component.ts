import { Component } from '@angular/core';
import { ApiService,AuthService } from 'src/app/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  model: any = {};
  hashedPassword: any;
  isVerified: boolean = false;
  isForget: boolean = false;
  otpSent: boolean = false;
  otp: any;
  countdown: number = 120; // Initial countdown value in seconds
  private timerId: any;
  constructor(private apiService:ApiService, private authService:AuthService, private router:Router){}

  ngOnInit(){
    this.loadUser();
  }

  toggleForget(){
    this.isForget = !this.isForget;
  }

  loadUser(){
    const payload = {
      id: this.authService.currentUser.user.id
    } 
    this.apiService.callApi('player/hash', 'post', payload).subscribe(
      (res) => {
        console.log(res)
        this.hashedPassword = res.hashedPassword;
      },
      (err) => {
        console.log(err)
      }
    )
  }

  formSubmit(event:any){
    const payload = {
      string: this.model.oldPassword,
      hash: this.hashedPassword
    }
    this.apiService.callApi('utils/hash/verify', 'post', payload).subscribe(
      (res) => {
        console.log(res.data)
        if(res.data){
          this.apiService.callApi('users/me', 'patch', {password: this.model.password}).subscribe(
            (res) => {
              console.log('password updated')
              Swal.fire({
                icon: 'success',
                title: 'Password Updated',
                text: 'Password updated successfully',
                showConfirmButton: false, // Remove the "OK" button
                timer: 2000 
              })
              this.router.navigate(['/auth/profile'])
            },
            (err) => {
              console.log('error while updating password')
              Swal.fire({
                icon: 'error',
                title: 'Something went wrong',
                text: 'Error while updating password',
                showConfirmButton: false, // Remove the "OK" button
                timer: 2000 
              })
            }
          )
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Invalid Password',
            text: 'old password invalid',
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 
          })
        }
      },
      (err) => {
        console.log(err)
      }
    )
  }

  sendOtp(){


    this.otp = Math.floor(1000 + Math.random() * 9000).toString();
    this.countdown = 120; 

    const payload = {
      email: this.authService.currentUser.user.email,
      subject: "Otp for registration",
      message: `Here is your 4 digit otp ${this.otp}`,
      type: 'forget'
    }
    this.apiService.callApi('my-api/sendmail', 'get', payload).subscribe(
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

  ngOnDestroy() {
    // Clear the timer when the component is destroyed
    this.clearTimer();
  }

  verifyOtp(){
    if(this.model.otp === parseInt(this.otp)){
      // Swal.fire({
      //   icon: 'success',
      //   title: "Otp Verified",
      //   showConfirmButton: false, // Remove the "OK" button
      //   timer: 2000 
      // })
      this.isVerified = true;
      this.forgetPassword('no')
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

  forgetPassword(event:any){
    if(this.isVerified && this.model.password){
      const payload = {password: this.model.password}
      this.apiService.callApi('users/me', 'patch', payload).subscribe(
        (res) => {
          console.log(res);
          Swal.fire({
            icon: 'success',
            title: 'Otp Verified',
            text: 'Password is changed',
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 
          })
          this.router.navigate(['/auth/profile'])
        },
        (err) => {
          console.log(err);
        }
      )
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Please enter password',
        text: '',
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 
      })
    }
  }
}
