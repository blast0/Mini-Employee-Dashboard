import { Routes } from '@angular/router';
import { EmployeeDashboardComponent } from './components/employee-dashboard/employee-dashboard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: EmployeeDashboardComponent,
  },
];