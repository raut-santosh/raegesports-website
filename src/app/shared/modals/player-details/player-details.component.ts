import { Component, Input } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from 'src/app/services';

@Component({
  selector: 'app-player-details',
  templateUrl: './player-details.component.html',
  styleUrls: ['./player-details.component.css']
})
export class PlayerDetailsComponent {
  @Input() data: any;
  model: any = {};
  constructor(public activeModal: NgbActiveModal, private apiService: ApiService) {}


  closeModal(data:any) {
      if(data){
        this.apiService.get('/users/me').subscribe(
          res=>{
            console.log(res);
            if(res.data){
              this.activeModal.close({ refresh: true, data: this.model });
            }
          }
        );
      }else{
        this.activeModal.close({ refresh: false, data: null });
      }
  }

}
