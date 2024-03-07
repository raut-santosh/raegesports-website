import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
import { environment } from 'src/environments/environments';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  constructor(private apiService: ApiService, private datePipe: DatePipe){}

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


  formatDate(date:any){
    return this.datePipe.transform(date, 'MMM dd, yyyy');
  }
}
