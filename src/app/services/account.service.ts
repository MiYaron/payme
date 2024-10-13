import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, catchError, map, Observable, of, take } from 'rxjs';

export interface Transaction {
  id: string;
  from: {id: string, name: string};
  to: {id: string, name: string};
  amount: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: string;
  balance: number;
  status: string;
}


@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = 'http://localhost:3001/api';

  user: User | null = null;

  private balanceSubject = new BehaviorSubject<number>(0);
  balance$ = this.balanceSubject.asObservable();

  private transactionsSubject = new BehaviorSubject<Transaction[]>([]);
  transactions$ = this.transactionsSubject.asObservable();
  


  constructor(private http: HttpClient, private cookieService: CookieService) {
    this.loadData();
  }

  loadData() {
      const token = this.cookieService.get("token");
      this.user = token? jwtDecode(token) : null;
      
      const headers = new HttpHeaders({
        Authentication: `Bearer ${token}`,
        'Content-type': 'application/json; charset=UTF-8',
      });

      if (this.user) {
        const response$ = this.http.get<{ balance: number; transactions: any[] }>(`${this.apiUrl}/dashboard`, { headers }).pipe(
          catchError(err => {
            console.error(err);
            return of({ balance: 0, transactions: [] });
          })
        );

        response$.subscribe(response => {
          this.balanceSubject.next(response.balance);

          const updatedTransactions = response.transactions.map(transaction => {
            transaction.id = transaction._id;
            if (transaction.from.id === this.user?.id) {
              transaction.amount *= -1;
            }
            return transaction;
          });

          this.transactionsSubject.next(updatedTransactions);
        });
      } else {
        this.balanceSubject.next(0);
        this.transactionsSubject.next([]);
      }
    }

    loadMoreTransactions() {
      this.transactions$.pipe(take(1)).subscribe(currTxs => {
        if (currTxs.length === 0) {
          return;
        }
    
        const lastItem = currTxs[currTxs.length - 1].id;
        
        const headers = new HttpHeaders({
          Authentication: `Bearer ${this.cookieService.get("token")}`,
          'Content-type': 'application/json; charset=UTF-8',
        });
    
        this.http.get<{transactions: any[]}>(`${this.apiUrl}/transactions?lastItem=${lastItem}`, { headers }).pipe(
          catchError(err => {
            console.error(err);
            return of({transactions: []});
          })
        ).subscribe(response => {
          const updatedTransactions = [...currTxs, ...response.transactions.map(transaction => {
            transaction.id = transaction._id;

            if (transaction.from.id === this.user?.id) {
              transaction.amount *= -1;
            }
            return transaction;
          })];
    
          this.transactionsSubject.next(updatedTransactions);
        });
      });
    }

    fold() {
      this.transactions$.pipe(take(1)).subscribe(currTxs => {
        currTxs.splice(5);
        this.transactionsSubject.next(currTxs);
      });
    }

  sendMoney(to: string, amount: number, setError: (message: string) => void): Observable<boolean> {
    const token = this.cookieService.get("token");
    const headers = new HttpHeaders({
      Authentication: `Bearer ${token}`,
      'Content-type': 'application/json; charset=UTF-8',
    });
  
    return this.http.post(`${this.apiUrl}/transactions`, { to, amount }, { headers }).pipe(
      map(() => {
        this.loadData();
        return true; 
      }),
      catchError(err => {
        setError(err.error?.message || 'An unknown error occurred');
        return of(false); 
      })
    );
  }
}