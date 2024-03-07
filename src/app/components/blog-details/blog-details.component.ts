import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environments';
import { DatePipe } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  id!: string;
  model: any;
  cats: any = [];
  blogs: any = [];
  comments: any = [];
  formData: any = {};
  categories: any = [];
  apiUrl = environment.apiUrl;
  constructor(private router: Router, private route:ActivatedRoute, public apiService:ApiService, private datePipe: DatePipe){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.getBlog();
    });
    this.getCats();
    this.getBlogs();
  }

  getBlog(){
    this.apiService.get('blogs', {filter: {'slug': this.id}, fields: ["*.*"]}).subscribe(
      res => {
        console.log(res);
        this.model = res.data[0];
        this.getComments();
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

  formatDate(date:any){
    return this.datePipe.transform(date, 'MMM dd, yyyy');
  }

  getBlogs(){
    this.apiService.get('blogs', {sort: '-date_created', limit: 3, fields:"*.*"}).subscribe(
      res => {
        console.log(res);
        this.blogs = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  getComments(){
    console.log(this.model?.id);
    this.apiService.get('blog_comments', {fields: "*.*", filter:{ "blog": { "_eq": this.model.id }}, limit:20, sort:"-date_created"}).subscribe(
      res => {
        console.log(res);
        this.comments = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  formSubmit(){
    this.formData.blog = this.model.id;
    this.formData.author = this.apiService.currentUserValue.id;
    this.apiService.save('blog_comments', this.formData).subscribe(
      (res:any) => {
        console.log(res);
        if(res.data){
          Swal.fire({
            icon: 'success',
            title: 'Comment Posted',
            text: "",
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }else{
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: res.errors[0].message,
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
        this.getComments();
      },
      err => {
        console.log(err);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: "Please login before commenting",
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
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

}
