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
  constructor(private apiService: ApiService, private datePipe: DatePipe){
    this.totalItems = 0;
  }

  blogs: any[] = [];
  apiUrl = environment.apiUrl;
  cats: any = [];
  categories: any = [];
  searchQuery: any = "";
  currentPage: number = 1;
  pageSize: number = 1; // Number of items per page
  totalItems: number = 0;
  ngOnInit(){
    this.getBlogs();
    this.getCats();
  }

  getBlogs(pageNumber: any = 1) {
    const offset = (pageNumber - 1) * this.pageSize;
    const params = {
      fields: '*.*',
      offset: offset.toString(),
      limit: this.pageSize.toString()
    };
  
    this.apiService.get('blogs', params).subscribe(
      res => {
        console.log(res);
        this.blogs = res.data;
        this.currentPage = pageNumber; // Update current page
        this.apiService.get('blogs', {aggregate: {count: "*"}}).subscribe(
          res => {
            console.log(res);
            this.totalItems = res.data[0].count;
          }
        )
      },
      err => {
        console.log(err);
      }
    );
  }
  

  nextPage() {
    console.log("Next page button clicked");
    const nextPage = this.currentPage + 1;
    this.getBlogs(nextPage);
  }
  
  prevPage() {
    console.log("Previous page button clicked");
    const prevPage = this.currentPage - 1;
    this.getBlogs(prevPage);
  }

  getPageNumbers(): (number | string)[] {
    const totalPages = Math.ceil(this.totalItems / this.pageSize);
    const visiblePages = 6; // Number of visible page numbers
    const currentPage = this.currentPage;
    
    if (totalPages <= visiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      const firstPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
      const lastPage = Math.min(firstPage + visiblePages - 1, totalPages); // Limit last page based on visiblePages
  
      let pages: (number | string)[] = [];
  
      if (firstPage > 1) {
        pages.push(1);
        if (firstPage > 2) {
          pages.push('ellipsis');
        }
      }
  
      for (let i = firstPage; i <= lastPage; i++) {
        pages.push(i);
      }
  
      if (lastPage < totalPages) {
        if (lastPage < totalPages - 1) {
          pages.push('ellipsis');
        }
        pages.push(totalPages);
      }
  
      return pages;
    }
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
