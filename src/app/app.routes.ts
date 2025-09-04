import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { ProgramsComponent } from './admin/programs/programs.component';
import { AgentsComponent } from './admin/agents/agents.component';
import { AdvertisementsComponent } from './admin/advertisements/advertisements.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  // Admin routes 
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'programs',
    component: ProgramsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'agents',
    component: AgentsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },
  {
    path: 'advertisements',
    component: AdvertisementsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['admin'] },
  },

  // User routes
  {
    path: 'user-profile',
    component: UserProfileComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },
  {
    path: 'order-advertising',
    component: AdvertisementsComponent,
    canActivate: [AuthGuard, RoleGuard],
    data: { roles: ['user'] },
  },

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
