// tournaments.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService, AuthService } from 'src/app/services';
import { environment } from 'src/environments/environments';
import { DatePipe } from '@angular/common';
import { interval, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import { PlayerDetailsComponent } from 'src/app/shared/modals/player-details/player-details.component';

@Component({
  selector: 'app-tournaments',
  templateUrl: './tournaments.component.html',
  styleUrls: ['./tournaments.component.css'],
  providers: [DatePipe],
})
export class TournamentsComponent implements OnInit, OnDestroy {

  games: any[] = [];
  apiUrl: string = environment.apiUrl;
  selectedGame: any = null;
  tournaments: any[] = [];
  countdowns: string[] = [];
  userData: any = {};
  private countdownSubscription!: Subscription;

  constructor(private modalService: NgbModal, private router: Router,private apiService: ApiService,private authService:AuthService, public datePipe: DatePipe, private route: ActivatedRoute) {
    this.getGames();
    this.route.params.subscribe(params => {
      // Extract the id from the route parameters
      const tournamentId = params['id'];

      // Now you can use the tournamentId as needed
      this.selectedGame = tournamentId;
      this.getTournaments(tournamentId);
      console.log(`Selected game ID: ${this.selectedGame}`);
    });
  }

  ngOnInit() {
    
  }

  ngOnDestroy() {
    // Unsubscribe from the countdown subscription to avoid memory leaks
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }
  }

  getGames() {
    this.apiService.get('games', null).subscribe(res => {
      console.log(res);
      this.games = res.data;
    });
  }

  selectGame(id: any) {
    if (this.selectedGame === id) {
      this.selectedGame = null;
      this.countdowns = [];
      this.tournaments = [];
      // Stop the countdown when a game is unselected
      if (this.countdownSubscription) {
        this.countdownSubscription.unsubscribe();
      }
    } else {
      this.selectedGame = id;
      this.getTournaments(this.selectedGame);

      // Start the countdown
      this.countdownSubscription = interval(1000).subscribe(() => {
        this.updateCountdowns();
      });
    }
    console.log(`selected game ${this.selectedGame}`);
  }

  getTournaments(gameId: any) {
    console.log('tournament called', gameId);
    this.apiService.callApi(`items/tournaments?filter={"game":{"_eq":"${gameId}"}}`, 'get').subscribe(res => {
      console.log('tournament res',res);
      this.tournaments = res.data;
      this.updateCountdowns();
    });
  }

  updateCountdowns() {
    // Update the countdowns for each tournament
    this.countdowns = this.tournaments.map(tournament => this.calculateCountdown(tournament.start_date));
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

      return `${hours}h : ${minutes}m : ${seconds}s`;
    } else {
      return 'End';
    }
  }

  participate(tournament: any){
    this.openModal().then((result) => {
      if(result.refresh == true){
        if(tournament.ticket_price === 'Free' || tournament.ticket_price === 'free' || tournament.ticket_price === '0'){
          // console.log('user', this.authService.currentUser.user)
          if(this.authService.currentUser.user.id){
    
            this.apiService.callApi(`my-api/participate?access_token=${environment.access_token}`,'post',{
              userId: this.authService.currentUser.user.id,
              tournamentId: tournament.id
            }).subscribe(
              (res) => {
                console.log(res);
                if(res.success){
                  Swal.fire({
                    title: 'Participated successfully!',
                    text: 'your participated to the tournament',
                    icon: 'success', // success, error, warning, info, or 'question'
                    confirmButtonText: 'OK',
                    confirmButtonColor: '#3085d6',
                  }); 
                }
              },
              (err) => {
                console.log(err)
                Swal.fire({
                  title: 'Error while participating!',
                  text: 'your not participated to the tournament',
                  icon: 'error', // success, error, warning, info, or 'question'
                  confirmButtonText: 'OK',
                  confirmButtonColor: '#3085d6',
                }); 
              }
            );
                   
          }else{
            Swal.fire({
              title: 'Your not logged in!',
              text: 'login first to participate in tournament',
              icon: 'warning', // success, error, warning, info, or 'question'
              confirmButtonText: 'OK',
              confirmButtonColor: '#3085d6',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/auth/login'])
              }
            }); 
          }
        }else{
        // if it is paid tournament 
        }
      }
    })
    
  }

  openModal(itemId?: string) {  
    const modalRef = this.modalService.open(PlayerDetailsComponent, {
      size: 'lg',
      centered: true,
      keyboard: true,
      backdrop: 'static',
    });
  
    // Pass the data to the modal component
    if (itemId) {
      const data = {
        id: itemId
      };
      console.log(data);
      modalRef.componentInstance.inputData = data;
    }
  
    modalRef.result.then((result) => {
      // Handle the result when the modal is closed
      // this.getList();
      console.log('result is here ', result);
    });

    return modalRef.result;
  }
  

}
