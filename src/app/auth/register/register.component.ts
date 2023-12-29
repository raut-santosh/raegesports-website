// register.component.ts

import { Component } from '@angular/core';
import { AuthService, HelperService, ApiService } from 'src/app/services';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  model: any = {};
  otp: any;
  isVerified: boolean = false;
  otpSent: boolean = false;
  countdown: number = 120; // Initial countdown value in seconds
  private isSubmitting: boolean = false;
  private timerId: any;

  formData: any[] = [
    {
      name: "first_name",
      required: true,
      type: "text",
      placeholder: "First Name *",
      regex: /^[A-Za-z]+$/,
      errorMsg: "Please enter characters only",
      emptyErrorMsg: "First name cannot be empty",
      validated: false
    },
    {
      name: "last_name",
      required: true,
      type: "text",
      placeholder: "Last Name *",
      regex: /^[A-Za-z]+$/,
      errorMsg: "Please enter characters only",
      emptyErrorMsg: "Last name cannot be empty",
      validated: false
    },
    {
      name: "location",
      required: false,
      type: "text",
      placeholder: "Location",
      regex: /^[a-zA-Z0-9\s]+$/,
      errorMsg: "Please enter valid location address",
      emptyErrorMsg: "Location cannot be empty",
      validated: true
    },
    {
      name: "mobile",
      required: true,
      type: "text",
      placeholder: "Mobile *",
      regex: /^[0-9]{10}$/,
      errorMsg: "Please enter valid mobile number",
      emptyErrorMsg: "Mobile number cannot be empty",
      validated: false
    },
    {
      name: "email",
      required: true,
      type: "email",
      placeholder: "Email *",
      regex: /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/,
      errorMsg: "Please enter a valid email address",
      emptyErrorMsg: "Email cannot be empty",
      validated: false
    },
    {
      name: "password",
      required: true,
      type: "password",
      placeholder: "Password *",
      regex: /^.{4,8}$/,
      errorMsg: "Please enter a password between 4 and 8 characters",
      emptyErrorMsg: "Password cannot be empty",
      validated: false
    },
    {
      name: "otp",
      required: false,
      type: "text",
      placeholder: "Otp *",
      regex: /^[0-9]{4}$/,
      errorMsg: "Please enter valid otp only 4 digits allowed",
      emptyErrorMsg: "Otp cannot be empty",
      validated: false
    },
  ];

  constructor(private authService: AuthService, private helperService: HelperService, private router: Router, private apiService: ApiService) { }

  
  validateField(field: any) {
    const fieldValue = this.model[field.name] || '';
  
    if (field.required) {
      field.validated = !!fieldValue;
      field.isEmptyError = !field.validated;
  
      if (field.validated) {
        field.isValidationError = false;
      }
    } else {
      if (fieldValue) {
        field.validated = true;
      } else {
        field.validated = false;
        field.isValidationError = false;
        return;
      }
    }
  
    if (!this.isSubmitting && field.name === 'otp') {
      if (fieldValue.length === 4) {
        if (fieldValue === this.otp) {
          field.validated = true;
          this.isVerified = true;
          field.isValidationError = false;
          this.isSubmitting = true; // Set the flag to indicate form submission
          this.formSubmit(null);
          return;
        } else {
          field.validated = false;
          field.isValidationError = true;
          Swal.fire({
            icon: 'error',
            title: 'Invalid Otp',
            showConfirmButton: false,
            timer: 2000
          });
        }
      }
    }

  
    if (field.validated && field.regex) {
      field.validated = field.regex.test(fieldValue);
      field.isValidationError = !field.validated;
    } else {
      field.isValidationError = false;
    }
  }
  
  
  
  
  
  
  
  
  
  showEmptyErrorMsg(fieldName: string, msg: string) {
    // Set an error flag for the field to show the error below it
    this.formData.find(field => field.name === fieldName).isEmptyError = true;
  }
  
  showValidationErrorMsg(msg: string) {
    Swal.fire({
      icon: 'error',
      title: 'Validation Error',
      text: msg,
      showConfirmButton: false,
      timer: 2000
    });
  }
  
  

  formSubmit(event: any) {
    this.formData.forEach(field => this.validateField(field));
    this.isSubmitting = true; 

    if (this.formData.every(field => field.validated || !field.required)) {
      if (this.isVerified) {
        this.authService.register(this.model).subscribe(
          (response) => {
            console.log('registred', response)
            if (response.success) {
              Swal.fire({
                icon: 'success',
                title: 'Registration successful',
                showConfirmButton: false,
                timer: 2000
              });
              this.router.navigate(['/auth/login'])
            } else {
              Swal.fire({
                icon: 'error',
                title: response.error.code,
                text: response.error.code == 'RECORD_NOT_UNIQUE' ? 'Email id already used' : response.message,
                showConfirmButton: false,
                timer: 2000
              })
            }
          },
          (error) => {
            console.log(error)
            Swal.fire({
              icon: 'error',
              title: error.code,
              text: error.message,
              showConfirmButton: false,
              timer: 2000
            })
          }
        )
      } else {
        Swal.fire({
          icon: 'error',
          title: "Invalid Otp",
          text: 'Please verify otp first',
          showConfirmButton: false,
          timer: 2000
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: "Validation Error",
        text: 'Please fill in all required fields correctly.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  sendOtp() {
    // Check if all required fields are validated
    const requiredFields = this.formData.filter(field => field.required);
    const allRequiredFieldsValidated = requiredFields.every(field => field.validated);
  
    if (allRequiredFieldsValidated) {
      // Generate and send OTP
      this.otp = Math.floor(1000 + Math.random() * 9000).toString();
      this.countdown = 120;
  
      const payload = {
        email: this.model.email,
        subject: "Otp for registration",
        message: `Here is your 4 digit otp ${this.otp}`,
        type: 'otp'
      };
  
      this.apiService.callApi('my-api/sendmail', 'post', payload).subscribe(
        (response) => {
          if (response.success) {
            // Update UI or perform additional actions if needed
            this.otpSent = true;
            this.startTimer();
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Email already exists',
              text: response.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      // Handle the case where required fields are not validated
      Swal.fire({
        icon: 'error',
        title: 'Validation Error',
        text: 'Please fill in all required fields with valid data before sending OTP.',
        showConfirmButton: false,
        timer: 2000
      });
    }
  }

  private startTimer() {
    this.timerId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearTimer();
        this.otpSent = false;
      }
    }, 1000);
  }

  private clearTimer() {
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  ngOnDestroy() {
    this.clearTimer();
  }

  verifyOtp() {
    if (this.model.otp === parseInt(this.otp)) {
      Swal.fire({
        icon: 'success',
        title: "Otp Verified",
        showConfirmButton: false,
        timer: 2000
      })
      this.isVerified = true;
    } else {
      Swal.fire({
        icon: 'error',
        title: "Invalid Otp",
        showConfirmButton: false,
        timer: 2000
      })
      this.isVerified = false;
    }
  }

  formatTimer(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
}
