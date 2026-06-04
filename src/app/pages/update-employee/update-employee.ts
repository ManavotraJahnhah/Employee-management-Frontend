import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyFieldConfig, FormlyFormOptions, FormlyModule } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';
import { Router } from '@angular/router';

import { EmployeeService } from '../../services/employee.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';
import { Employee } from '../../models/employee';
import { Department } from '../../models/Department';
import { Responsibility } from '../../models/Responsibility';

interface EmployeeFormModel {
  name: string;
  surname: string;
  dateOfBirth: string;
  departmentId: number;
  responsibilities: number[];
  dailySalary: number;
  salaryHandling: string;
}

@Component({
  selector: 'app-update-employee',
  standalone: true,
  imports: [CommonModule, FormlyModule, FormlyBootstrapModule, ReactiveFormsModule],
  templateUrl: './update-employee.html',
  styleUrls: ['./update-employee.css'],
})
export class UpdateEmployeeComponent implements OnInit {
  form = new FormGroup({});
  model: EmployeeFormModel = {
    name: '',
    surname: '',
    dateOfBirth: '',
    departmentId: 0,
    responsibilities: [],
    dailySalary: 0,
    salaryHandling: 'Bank',
  };

  options: FormlyFormOptions = {};
  showSuccess = false;

  editing = false;
  editId: number | null = null;

  pageTitle = 'Create Employee';

  departments: Department[] = [];
  responsibilities: Responsibility[] = [];

  departmentOptions: { label: string; value: number }[] = [];
  responsibilityOptions: { label: string; value: number }[] = [];

  constructor(
    private employeeService: EmployeeService,
    private selectedEmployeeService: SelectedEmployeeService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadDepartmentsAndResponsibilities();

    const selectedId = this.selectedEmployeeService.getSelectedSnapshot();

    if (selectedId) {
      this.editId = selectedId;
      this.editing = true;
      this.pageTitle = 'Update Employee';

      this.employeeService.getEmployeeById(selectedId).subscribe((emp) => {
        this.model = {
          name: emp.name,
          surname: emp.surname,
          dateOfBirth: emp.dateOfBirth?.toString().split('T')[0] ?? '',
          departmentId: emp.Department?.id ?? 0,
          responsibilities: emp.Responsibilities?.map((r) => r.id).filter((id): id is number => id !== undefined) ?? [],
          dailySalary: emp.dailySalary,
          salaryHandling: emp.salaryHandling,
        };
      });
    }
  }

  private loadDepartmentsAndResponsibilities(): void {
    this.employeeService.getDepartments().subscribe((depts) => {
      this.departments = depts;
      this.departmentOptions = depts.map((d) => ({
        label: d.name,
        value: d.id ?? 0,
      }));
      this.updateFields();
    });

    this.employeeService.getResponsibilities().subscribe((resps) => {
      this.responsibilities = resps;
      this.responsibilityOptions = resps.map((r) => ({
        label: r.name,
        value: r.id ?? 0,
      }));
      this.updateFields();
    });
  }

  private updateFields(): void {
    // Update the fields with dynamic options
    const departmentField = this.fields.find((f) => f.key === 'departmentId');
    if (departmentField && departmentField.templateOptions) {
      departmentField.templateOptions['options'] = this.departmentOptions;
    }

    const responsibilityField = this.fields.find((f) => f.key === 'responsibilities');
    if (responsibilityField && responsibilityField.templateOptions) {
      responsibilityField.templateOptions['options'] = this.responsibilityOptions;
    }
  }

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      templateOptions: {
        label: 'Name',
        placeholder: 'Enter first name',
        required: true,
        maxLength: 50,
      },
    },
    {
      key: 'surname',
      type: 'input',
      templateOptions: {
        label: 'Surname',
        placeholder: 'Enter surname',
        required: true,
        maxLength: 50,
      },
    },
    {
      key: 'dateOfBirth',
      type: 'input',
      templateOptions: {
        type: 'date',
        label: 'Date of Birth',
        placeholder: 'Select date of birth',
        required: true,
      },
    },
    {
      key: 'departmentId',
      type: 'select',
      templateOptions: {
        label: 'Department',
        placeholder: 'Select department',
        required: true,
        options: [],
      },
    },
    {
      key: 'responsibilities',
      type: 'select',
      templateOptions: {
        label: 'Responsibilities',
        placeholder: 'Select responsibilities',
        options: [],
        multiple: true,
        required: false,
        attributes: {
          size: 1,
        },
      },
    },
    {
      key: 'dailySalary',
      type: 'input',
      templateOptions: {
        type: 'number',
        label: 'Daily Salary',
        placeholder: 'Enter daily salary',
        required: true,
        min: 0,
        step: 0.01,
      },
    },
    {
      key: 'salaryHandling',
      type: 'select',
      templateOptions: {
        label: 'Salary Handling',
        required: true,
        options: [
          { label: 'Bank', value: 'Bank' },
          { label: 'Cash', value: 'Cash' },
          { label: 'Other', value: 'Other' },
        ],
      },
    },
  ];

  saveEmployee(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: EmployeeFormModel = {
      name: this.model.name,
      surname: this.model.surname,
      dateOfBirth: this.model.dateOfBirth,
      departmentId: this.model.departmentId,
      responsibilities: this.model.responsibilities,
      dailySalary: this.model.dailySalary,
      salaryHandling: this.model.salaryHandling,
    };

    if (this.editing && this.editId) {
      this.employeeService
        .updateEmployee(this.editId, payload as unknown as Employee)
        .subscribe(() => this.afterSave());
    } else {
      this.employeeService
        .createEmployee(payload as unknown as Employee)
        .subscribe(() => this.afterSave());
    }
  }

  private afterSave(): void {
    this.showSuccess = true;

    setTimeout(() => {
      this.selectedEmployeeService.clear();
      this.router.navigate(['/employees']);
    }, 500);
  }
}
