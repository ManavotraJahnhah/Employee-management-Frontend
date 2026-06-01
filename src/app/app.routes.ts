import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { EmployeeListComponent } from './pages/employee-list/employee-list';
import { UpdateEmployeeComponent } from './pages/update-employee/update-employee';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'update-employee', component: UpdateEmployeeComponent },
  { path: 'update-employee/:index', component: UpdateEmployeeComponent },
  { path: '**', redirectTo: '' }
];
