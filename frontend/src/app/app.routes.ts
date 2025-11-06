import { Routes } from '@angular/router';
import { Home } from './Pages/home/home';
import { Login } from './Pages/login/login';
export const routes: Routes = [
{path: 'Login', component: Login},
{path: '', component: Login},
{ path: 'Home', component: Home },
{ path: '**', redirectTo: '', pathMatch: 'full' },
];
