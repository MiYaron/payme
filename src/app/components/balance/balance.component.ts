import { Component, OnInit } from '@angular/core';
import { AccountService } from './../../services/account.service';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-balance',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './balance.component.html',
  styleUrl: './balance.component.css'
})
export class BalanceComponent{
  balance$: Observable<number>;
  txForm: FormGroup;
  isFormVisible = false;
  errorMessage = '';

  constructor(private accountService: AccountService, private formBuilder: FormBuilder) {
    this.balance$ = this.accountService.balance$;
    this.txForm = this.formBuilder.group({
      to: ['', [Validators.required]],
      amount: ['', [Validators.required]]
    });
    this.errorMessage = '';
  }

  toggleForm() {
    this.txForm.reset();
    this.setErrorMessage('');
    this.isFormVisible = ! this.isFormVisible;
  }

  sendMoney() {
    if (!this.isFormVisible) {
      this.toggleForm();
    } else {
      const { to, amount } = this.txForm.value;
      this.accountService.sendMoney(to, amount, (message) => this.setErrorMessage(message))
      .subscribe((success) => {
        if (success) {
          this.toggleForm();
        }
      })
    }
  }
  
  cancel() {
    this.toggleForm();
  }

  setErrorMessage(message: string) {
    this.errorMessage = message;
  }
}
