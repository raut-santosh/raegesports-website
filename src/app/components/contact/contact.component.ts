import { Component } from '@angular/core';
import { ApiService } from'src/app/services';
import Swal from 'sweetalert2';
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
        Swal.fire({
          title: 'Your Message Sent Successfully!',
          text: '',
          icon: 'success', // success, error, warning, info, or 'question'
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }); 
        this.model = {};
      },
      err => {
        console.log(err);
        Swal.fire({
          title: 'Something went wrong',
          text: '',
          icon: 'error', // success, error, warning, info, or 'question'
          confirmButtonText: 'OK',
          confirmButtonColor: '#3085d6',
        }); 
      }
    )
  }
}
