import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import { AuthService } from 'src/app/services';
import { Router } from '@angular/router';
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
  imgUrl:any;
  constructor(private apiService: ApiService, public authService:AuthService, private router:Router){
   this.imgUrl = authService.getAvtar;
  }

  ngOnInit(){
    this.model = this.authService.currentUser.user ? this.authService.currentUser.user: {first_name: "Guest", last_name: "User", balance:0, location:"Unknown", mobile:"Unknown", email:"Unknown"}
  }

  formSubmit(event:any){
    delete this.model['tfa_secret']
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
    if(this.authService.currentUser.user){
      this.isEdit = !this.isEdit;
    }else{
      Swal.fire({
        icon: 'error',
        title: 'Please login first to update profile!',
        showConfirmButton: false, // Remove the "OK" button
        timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
      });
      this.router.navigate(['/auth/login']);
    }
  }

  updateAvtar(event: any): void {
   const file = event.target.files[0];
   console.log(file)
   this.authService.updateAvatar(file).subscribe(
    (res) => {
      console.log('res', res);
      const profileImage = document.getElementById('profileImage') as HTMLImageElement;

      if (profileImage) {
        profileImage.src = profileImage.src + '&' + new Date().getTime();
      }
    },
   (err) => {
    console.log('err ',err)
   }
   )
  }
  
  
  
}
