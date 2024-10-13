import { AccountService, User } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BalanceComponent } from '../../components/balance/balance.component';
import { TxlistComponent } from '../../components/txlist/txlist.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [BalanceComponent,TxlistComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  user: User | null = null;

  constructor(private accountService: AccountService, private authService: AuthService) {
    this.user = accountService.user;
  }

  signout() {
    this.authService.signout();
  }
}
