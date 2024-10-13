import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AccountService, Transaction } from '../../services/account.service';
import { TransactionComponent } from '../transaction/transaction.component';

@Component({
  selector: 'app-txlist',
  standalone: true,
  imports: [CommonModule,TransactionComponent],
  templateUrl: './txlist.component.html',
  styleUrl: './txlist.component.css'
})
export class TxlistComponent {
  transactions$: Observable<Transaction[]>

  constructor(private accountService: AccountService) {
    this.transactions$ = this.accountService.transactions$;
  }

  fold(){
    this.accountService.fold();
  }
  showMore() {
    this.accountService.loadMoreTransactions();
  }
}
