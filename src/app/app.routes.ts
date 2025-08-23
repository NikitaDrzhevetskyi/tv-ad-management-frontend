import { Routes } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { ProgramsComponent } from './pages/programs/programs.component';
import { AgentsComponent } from './pages/agents/agents.component';
import { AdvertisementsComponent } from './pages/advertisements/advertisements.component';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'programs', component: ProgramsComponent },
  { path: 'customers', component: CustomersComponent },
  { path: 'agents', component: AgentsComponent },
  { path: 'advertisements', component: AdvertisementsComponent },
  { path: '**', redirectTo: 'dashboard' },
];
