import { Routes } from '@angular/router';
import { PasswordCheckerComponent } from './password-checker/password-checker.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
	{ path: '', component: PasswordCheckerComponent, canActivate: [AuthGuard], title: 'Dashboard | VKarma Password Manager' },
	{ path: 'login', component: LoginComponent, title: 'Sign In | VKarma Password Manager' },
	{ path: 'register', component: RegisterComponent, title: 'Create Account | VKarma Password Manager' },
	{ path: '**', redirectTo: '' }
];
