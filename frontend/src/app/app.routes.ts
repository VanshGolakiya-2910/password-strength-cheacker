import { Routes } from '@angular/router';
import { PasswordCheckerComponent } from './password-checker/password-checker.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';

export const routes: Routes = [
	{ path: '', component: PasswordCheckerComponent },
	{ path: 'login', component: LoginComponent },
	{ path: 'register', component: RegisterComponent },
	{ path: '**', redirectTo: '' }
];
