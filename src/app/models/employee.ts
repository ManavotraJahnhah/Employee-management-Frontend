import { Department } from './Department';
import { Responsibility } from './Responsibility';

export interface Employee {
  id?: number;
  name: string;
  surname: string;
  dailySalary: number;
  salaryHandling: string;
  dateOfBirth: string;
  DepartmentId?: number;
  Department?: Department;
  Responsibilities?: Responsibility[];
  createdAt?: string;
  updatedAt?: string;
}
