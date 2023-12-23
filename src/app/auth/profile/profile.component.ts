import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AuthService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  model: any = {};
  avatar: any;
  isEdit: boolean = false;
  constructor(private apiService: ApiService, public authService:AuthService){}

  ngOnInit(){
    this.model = this.authService.currentUser.user;
  }

  formSubmit(event:any){
    delete this.model['tfa_secret']
    delete this.model['password']
    this.apiService.callApi('users/me', 'patch', this.model).subscribe(
      (response) => {
        console.log('user updated: ', response)
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          showConfirmButton: false, // Remove the "OK" button
          timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
        });
        this.isEdit = false;
      },
      (error) => {
        console.log('error updating user: ', error)
      }
    )
  }

  toggleEdit(){
    this.isEdit = !this.isEdit;
  }
}
