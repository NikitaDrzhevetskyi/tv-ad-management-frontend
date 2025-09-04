import { Routes } from '@angular/router';
import { DashboardComponent } from './admin/dashboard/dashboard.component';
import { CustomersComponent } from './admin/customers/customers.component';
import { ProgramsComponent } from './admin/programs/programs.component';
import { AgentsComponent } from './admin/agents/agents.component';
import { AdvertisementsComponent } from './admin/advertisements/advertisements.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { UserProfileComponent } from './user/user-profile/user-profile.component';
// import { AuthGuard } from './guards/auth';
// import { RoleGuard } from './guards/role';

export const routes: Routes = [
  // Public routes
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },

  //Admin routes
  {
    path: 'dashboard',
    component: DashboardComponent,
  },
  {
    path: 'programs',
    component: ProgramsComponent,
  },
  {
    path: 'customers',
    component: CustomersComponent,
  },
  {
    path: 'agents',
    component: AgentsComponent,
  },
  {
    path: 'advertisements',
    component: AdvertisementsComponent,
  },

  // User routes
  {
    path: 'user-profile',
    component: UserProfileComponent,
  },
  {
    path: 'order-advertising',
    component: AdvertisementsComponent,
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
