import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { ProgramsComponent } from './admin/programs/programs.component';
import { AgentsComponent } from './admin/agents/agents.component';
import { AdvertisementsComponent } from './admin/advertisements/advertisements.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Protected routes - Admin only
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [],
  },
  {
    path: 'programs',
    component: ProgramsComponent,
    canActivate: [],
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [],
  },
  {
    path: 'agents',
    component: AgentsComponent,
    canActivate: [],
  },
  {
    path: 'advertisements',
    component: AdvertisementsComponent,
    canActivate: [],
  },
  
  //route for user
  {
    path: 'advertise-request',
    component: AdvertisementsComponent,
    canActivate: [],
  },

  // Default redirects
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
