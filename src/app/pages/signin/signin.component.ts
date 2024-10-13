import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signin',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})
export class SigninComponent {
  signinForm: FormGroup;
  errorMessage: string;

  constructor(private authService: AuthService, private formBuilder: FormBuilder, private router: Router) {
    this.signinForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.errorMessage = '';
  }

  signin() {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;
      this.authService.signin(email, password, (message) => this.setErrorMessage(message));
    } else {
      this.setErrorMessage("Please fill all fields")
    }
  }

  signup() {
    this.router.navigate(['/signup']);
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
