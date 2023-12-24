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
  constructor(private apiService:ApiService, private authService:AuthService, private router:Router){}

  ngOnInit(){
    this.loadUser();
  }

  enableForget(){
    this.isForget = true;
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
            title: 'Invalid Credentials',
            text: 'Email or Password Invalid',
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

  forgetPassword(event:any){

  }
}
