import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  games: any[] = [];
  members: any[] = [];
  apiUrl: string = environment.apiUrl;
  constructor(private apiService: ApiService){
    this.getGames();
    this.getMembers();
  }

  ngOnInit() {
    // this.getGames();
  }

  getGames(){
    this.apiService.get('games', null, ).subscribe(res => {
      console.log(res);
      this.games = res.data;
    });
  }

  getMembers(){
    this.apiService.get('members', null, ).subscribe(res => {
      console.log(res);
      this.members = res.data;
    });
  }
}
