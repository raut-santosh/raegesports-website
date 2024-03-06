import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent {
  id!: string;
  model: any;
  apiUrl = environment.apiUrl;
  constructor(private router: Router, private route:ActivatedRoute, private apiService:ApiService){}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id')!;
      this.getBlog();
    });
  }

  getBlog(){
    this.apiService.get('blogs', {filter: {'slug': this.id}, fields: ["*.*"]}).subscribe(
      res => {
        console.log(res);
        this.model = res.data[0];
        console.log(this.model.featured_image.id)
      },
      err => {
        console.log(err);
      }
    )
  }
}
