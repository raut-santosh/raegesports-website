import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
import { environment } from 'src/environments/environments';
import { DatePipe } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent {
  news: any[] = [];
  recent:any[] = [];
  apiUrl = environment.apiUrl;
  searchQuery: any = "";
  currentPage: number = 1;
  pageSize: number = 10; // Number of items per page
  totalItems: number = 0;
  category: any;
  constructor(private apiService: ApiService, private datePipe: DatePipe, private router: Router, private route: ActivatedRoute){
    this.totalItems = 0;
  }
  ngOnInit(){
    this.getNews();
    this.getRecents();
  }

  getNews(pageNumber: any = 1) {
    const offset = (pageNumber - 1) * this.pageSize;
    const params = {
      fields: '*.*',
      offset: offset.toString(),
      limit: this.pageSize.toString(),
    };
  
    this.apiService.get('news', params).subscribe(
      res => {
        console.log(res);
        this.news = res.data;
        this.currentPage = pageNumber; // Update current page
        this.apiService.get('news', {aggregate: {count: "*"}}).subscribe(
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
    this.getNews(nextPage);
  }
  
  prevPage() {
    console.log("Previous page button clicked");
    const prevPage = this.currentPage - 1;
    this.getNews(prevPage);
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


  getRecents(){
    this.apiService.get('news', {limit: 3, sort: "-date_created", fields:"*.*"}).subscribe(
      res => {
        console.log(res);
        this.recent = res.data;
      }
    )
  }


  formatDate(date:any){
    return this.datePipe.transform(date, 'MMM dd, yyyy');
  }

  search(){
    this.apiService.get('news', {"fields":"*.*", "search": this.searchQuery}).subscribe(
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
