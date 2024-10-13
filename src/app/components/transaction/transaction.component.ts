import { Component, Input } from '@angular/core';
import { Transaction } from '../../services/account.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './transaction.component.html',
  styleUrl: './transaction.component.css'
})
export class TransactionComponent {
  @Input() transaction!: Transaction;
}
