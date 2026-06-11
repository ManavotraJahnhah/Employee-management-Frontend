import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { EmployeeListComponent } from './pages/employee-list/employee-list';
import { UpdateEmployeeComponent } from './pages/update-employee/update-employee';
import { Responsibilities } from './pages/responsibilities/responsibilities';
import { DepartmentListComponent } from './pages/departments/departments';

// Déclaration des routes de l'application
// Chaque entrée mappe une URL à un composant Angular
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'employees', component: EmployeeListComponent },
  { path: 'update-employee', component: UpdateEmployeeComponent },
  { path: 'departments', component: DepartmentListComponent },
  { path: 'responsibilities', component: Responsibilities },
  // route avec paramètre pour modifier un employé existant
  { path: 'update-employee/:index', component: UpdateEmployeeComponent },
  // fallback vers la page d'accueil
  { path: '**', redirectTo: '' },
];
