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
  highlights: any[] = [];
  contests: any[] = [];

  apiUrl: string = environment.apiUrl;
  constructor(private apiService: ApiService){
    this.getGames();
    this.getMembers();
    this.getHighlights();
    this.getContests();
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

  getHighlights(){
    this.apiService.get('match_highlights').subscribe(res => {
      console.log(res);
      this.highlights = res.data;
    })
  }

  getContests(){
    this.apiService.get('contests').subscribe(res => {
      console.log(res);
      this.contests = res.data;
    })
  }
}
