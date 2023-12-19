import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  

  constructor(private toastr: ToastrService) { }

  presentToast(type: 'success' | 'error' | 'info' = 'success', title: string = 'Notification', message: string): void {
    switch (type) {
      case 'success':
        this.toastr.success(message, title);
        break;
      case 'error':
        this.toastr.error(message, title);
        break;
      case 'info':
        this.toastr.info(message, title);
        break;
      default:
        // Default to success if an invalid type is provided
        this.toastr.success(message, title);
        break;
    }
  }

}
