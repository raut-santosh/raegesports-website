import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {
  model: any = {};
  constructor(private apiService:ApiService){}
  ngOnInit() {

  }

  formSubmit(event:any){
    this.apiService.save('contact_us', this.model).subscribe(
      res => {
        console.log(res);
      },
      err => {
        console.log(err);
      }
    )
  }
}
