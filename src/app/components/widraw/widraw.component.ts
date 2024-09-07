import { Component } from '@angular/core';
import { ApiService } from 'src/app/services';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-widraw',
  templateUrl: './widraw.component.html',
  styleUrls: ['./widraw.component.css']
})
export class WidrawComponent {
  model: any = {};
  errorMsg: string = '';
  constructor(public apiService: ApiService){}

  ngOnInit() {
  }

  validateField(field: string){
    console.log(field);
    if(this.model.amount === 0){
      this.errorMsg = "Please enter a valid amount";
      return false
    }else if(this.model.amount > this.apiService.currentUserValue.balance){
      this.errorMsg = "Insufficient balance";
      return false
    }else{
      this.errorMsg = "";
      return true
    }
  }
  formSubmit(event:any){
    if(this.errorMsg == "" && this.model.amount !== 0 && this.model.upi_id){
      this.model.player = this.apiService.currentUserValue.id;
      this.apiService.save('withdraw_requests', this.model).subscribe(res => {
        console.log(res);
        Swal.fire({
          title: 'Withdrawal request is sent successfully',
          text: '',
          icon: 'success',
          confirmButtonText: 'OK',
        });
        this.model = {}
      })
    }
  }
}
