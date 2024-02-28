import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
import { environment } from 'src/environments/environments';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  constructor(private apiService: ApiService){}

  blogs: any[] = [];
  apiUrl = environment.apiUrl;

  ngOnInit(){
    this.getBlogs();
  }

  getBlogs(){
    this.apiService.get('blogs', {"fields":"*.*"}).subscribe(
      res => {
        console.log(res);
        this.blogs = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }
}
