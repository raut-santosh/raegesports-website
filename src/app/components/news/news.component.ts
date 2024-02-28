import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
import { environment } from'src/environments/environments';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  news: any[]=[];
  apiUrl = environment.apiUrl;
  constructor(private apiService: ApiService){}

  ngOnInit(){
    this.getNews();
  }

  getNews(){
    this.apiService.get('news', {"fields":"*.*"}).subscribe(
      res => {
        console.log(res);
        this.news = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }
}
