import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent {
  signupForm: FormGroup;
  errorMessage = '';

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      phone: [''],
    });
    this.errorMessage = '';
  }
  signin() {
    this.router.navigate(['/signin']);
  }
  signup() {
    if (this.signupForm.valid) {
      const { name, email, password, confirmPassword, phone } = this.signupForm.value;

      if (password !== confirmPassword) {
        this.setErrorMessage("Passwords not match");
        return;
      }

      this.authService.signup(name,email,password,phone, (message) => this.setErrorMessage(message));
    } else {
      this.setErrorMessage("Please fill all required fields")
    }
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
