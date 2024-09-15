import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
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
  isPassChange: boolean = false;
  imgUrl:any;
  tournaments: any = [];
  countdowns: string[] = [];
  apiUrl: string = environment.apiUrl
  games: any [] = [];
  private countdownSubscription!: Subscription;


  constructor(public datePipe: DatePipe,public apiService: ApiService, private router:Router, private route:ActivatedRoute){
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
    this.getGames();
  }

  ngOnDestroy() {
    // Unsubscribe from the countdown subscription to avoid memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  getGames(){
    this.apiService.get('games', null).subscribe(res => {
      console.log(res);
      this.games = res.data;
    });
  }
  

  formSubmit(event:any){
    if (this.checkRequiredFields()) {
      let body: any = {
        id: this.model.id,
        first_name: this.model.first_name,
        last_name: this.model.last_name,
        email: this.model.email,
        location: this.model.location,
        mobile: this.model.mobile,
        description: this.model.description,
        date_of_birth: this.model.date_of_birth,
        game: this.model.game,
        game_username: this.model.game_username,
        in_game_id: this.model.in_game_id,
        raeg_id: this.model.raeg_id
      };
      
      this.apiService.save('/users/me', body).subscribe(
        (response) => {
          console.log('user updated: ', response)
          Swal.fire({
            icon: 'success',
            title: 'Profile Updated',
            showConfirmButton: false, // Remove the "OK" button
            timer: 2000 // Set the timer for 2000 milliseconds (2 seconds)
          });
          this.apiService.auth('logout').subscribe(data => console.log(data));
          this.isEdit = false;
        },
        (error) => {
          console.log('error updating user: ', error)
        }
      )
    }
    
  }

  toggleEdit(){
    this.isEdit = !this.isEdit;
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


checkRequiredFields() {
  const inputs = document.querySelectorAll<HTMLInputElement>('input#exampleInputEmail1[required]');
  let hasError = false;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      hasError = true;
    }
  });

  if (hasError) {
    Swal.fire({
      icon: 'error',
      title: 'Required Fields',
      text: 'Please fill in all required fields before submitting.',
    });

    return false; // Prevent further submission if needed
  }

  return true; // Allow submission if all fields are filled
}

  
  participatedTournaments() {
    this.apiService.get('tournaments_directus_users?fields=*,tournaments_id.*,directus_users_id.*').subscribe(
        res => {
            console.log(res);
            const data = res.data;
            
            const uniqueTournaments: any[] = [];
            const uniqueIds = new Set();

            data.forEach((item:any) => {
                const tournamentId = item.tournaments_id.id;

                if (!uniqueIds.has(tournamentId)) {
                    uniqueIds.add(tournamentId);
                    uniqueTournaments.push(item);
                }
            });

            console.log(uniqueTournaments);
            this.tournaments = uniqueTournaments;
        }
    );
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
    
  formatDate(date:any){
    return this.datePipe.transform(date, 'MMM dd, yyyy');
  }

}
