import { Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { VerificationComponent } from './pages/verification/verification.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'signin', component: SigninComponent, canActivate: [authGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [authGuard] },
    { path: 'verification', component: VerificationComponent },
    { path: '', component: DashboardComponent, canActivate: [authGuard] },
    { path: '**', redirectTo: '' } 
]