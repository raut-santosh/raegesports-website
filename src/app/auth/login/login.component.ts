import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  model: any = {};
  loginForm!: FormGroup;
  isPasswordVisible: boolean = false;

  constructor(public authService: AuthService, private router: Router, private fb: FormBuilder){
    this.createForm();
  }

  formData: any[] = [
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
    }
    
  ];
  

  togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

  private createForm(): void {
    const formGroupConfig: { [key: string]: any[] } = {};
  
    this.formData.forEach((item) => {
      const validators = item.required ? [Validators.required] : [];
      if (item.regex) {
        validators.push(Validators.pattern(item.regex));
      }
  
      formGroupConfig[item.name] = ['', validators];
    });
  
    this.loginForm = this.fb.group(formGroupConfig);
  }

  leaveCheck(fieldName: string): void {
    const control = this.loginForm.get(fieldName);

    if (control) {
      control.markAsDirty();
      if (!control.value) {
        control.setErrors({ required: true });
      }
    }
  }

  formSubmit(): void {
    console.log(this.model)
    if (this.loginForm.invalid) {
      console.error('Form data is invalid');
    } else {
      console.log('model:', this.loginForm.value);
      this.authService.login(this.loginForm.value).subscribe(
        (response) => {
          console.log(response);
          if (response) {
            Swal.fire({
              icon: 'success',
              title: 'Login successful',
              showConfirmButton: false,
              timer: 2000
            });
            this.router.navigate(['/auth/profile']);
          }
        },
        (error) => {
          console.log(error);
          Swal.fire({
            icon: 'error',
            title: error.code,
            text: 'Email or Password Invalid',
            showConfirmButton: false,
            timer: 2000
          });
        }
      );
    }
  }
}