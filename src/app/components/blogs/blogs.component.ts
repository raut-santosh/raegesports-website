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
  cats: any = [];
  categories: any = [];
  searchQuery: any = "";
  ngOnInit(){
    this.getBlogs();
    this.getCats();
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

  getCats(){
    this.apiService.get('categories').subscribe(
      res => {
        console.log(res);
        this.cats = res.data;
        this.getCatCount();
      },
      err => {
        console.log(err);
      }
    )
  }


  getCatCount(){
    for(let i=0; i<this.cats.length; i++){
      // console.log(this.cats[i]);
      this.apiService.get('blogs', {filter: {category: this.cats[i].name}, "aggregate": {"count": "category"}}).subscribe(
        res => {
          this.categories.push({name: this.cats[i].name, count: res.data[0].count.category});
        }
      )
    }
  }

  formatDate(date:any){
    return this.datePipe.transform(date, 'MMM dd, yyyy');
  }

  search(){
    this.apiService.get('blogs', {"fields":"*.*", "search": this.searchQuery}).subscribe(
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
