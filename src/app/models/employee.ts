import { Department } from './Department';
import { Responsibility } from './Responsibility';

// Interface TypeScript décrivant la forme d'un objet Employee côté client
// Correspond approximativement au modèle Sequelize exposé par l'API
export interface Employee {
  id?: number;
  employeeCode: string;
  name: string;
  surname: string;
  dailySalary: number;
  salaryHandling: string;
  dateOfBirth: string;
  DepartmentId?: number;
  Department?: Department; // relation optionnelle
  Responsibilities?: Responsibility[]; // relation N:M optionnelle
  createdAt?: string;
  updatedAt?: string;
}
