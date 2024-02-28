import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

import Swal from 'sweetalert2';
import { Subscription, interval } from 'rxjs';
import { environment } from 'src/environments/environments';

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
  tournaments: any = [];
  countdowns: string[] = [];
  apiUrl: string = environment.apiUrl
  private countdownSubscription!: Subscription;


  constructor(public datePipe: DatePipe,public apiService: ApiService, private router:Router){
   this.imgUrl = apiService;
   this.model = this.apiService.currentUserValue ? this.apiService.currentUserValue: {first_name: "Guest", last_name: "User", balance:0, location:"Unknown", mobile:"Unknown", email:"Unknown"}
    console.log(this.apiService.currentUserValue)
  }

  ngOnInit(){
    this.participatedTournaments();
    // Subscribe to the countdown
    this.countdownSubscription = interval(1000).subscribe(() => {
      this.updateCountdowns();
    });

    console.log(this.apiService.currentUserValue)
    
  }

  ngOnDestroy() {
    // Unsubscribe from the countdown subscription to avoid memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }
  

  formSubmit(event:any){
    delete this.model['tfa_secret']
    delete this.model['password']
    this.apiService.save('users/me', this.model).subscribe(
      (response) => {
        console.log('user updated: ', response)
        Swal.fire({
          icon: 'success',
          title: 'Profile Updated',
          showConfirmButton: false, // Remove the "OK" button
          timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
        });
        // this.authService.updateUserDetails(response)
        this.isEdit = false;
      },
      (error) => {
        console.log('error updating user: ', error)
      }
    )
  }

  toggleEdit(){
    // if(this.authService.currentUser.user){
    //   this.isEdit = !this.isEdit;
    // }else{
    //   Swal.fire({
    //     icon: 'error',
    //     title: 'Please login first to update profile!',
    //     showConfirmButton: false, // Remove the "OK" button
    //     timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
    //   });
    //   this.router.navigate(['/auth/login']);
    // }
  }

  updateAvtar(event: any): void {
   const file = event.target.files[0];
   console.log(file)
  //  this.authService.updateAvatar(file).subscribe(
  //   (res) => {
  //     console.log('res', res);
  //     const profileImage = document.getElementById('profileImage') as HTMLImageElement;

  //     if (profileImage) {
  //       profileImage.src = profileImage.src + '&' + new Date().getTime();
  //     }
  //   },
  //  (err) => {
  //   console.log('err ',err)
  //  }
  //  )
  }
  
  participatedTournaments(){
    this.apiService.get('tournaments_directus_users?fields=*,tournaments_id.*,directus_users_id.*').subscribe(
      res => {
        console.log(res)
        this.tournaments = res.data;
      }
    )
  }

  calculateCountdown(start_date: string): string {
    const parsedStartDate = new Date(start_date);
    const now = new Date();
    const timeDifference = parsedStartDate.getTime() - now.getTime();
  
    if (timeDifference > 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);
  
      return `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    } else {
      return 'End';
    }
  }
  updateCountdowns() {
    // Update the countdowns for each tournament
    this.countdowns = this.tournaments.map((tournament:any) => this.calculateCountdown(tournament.tournaments_id.start_date));
  }
    
  
}
