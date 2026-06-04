import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { EmployeeService } from '../../services/employee.service';
import { SelectedEmployeeService } from '../../services/selected-employee.service';

import { EmployeeViewModalComponent } from '../../shared/employee-view-modal';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';
import { WjGridFilterModule } from '@mescius/wijmo.angular2.grid.filter';
import { WjGridSearchModule } from '@mescius/wijmo.angular2.grid.search';
import { WjInputModule } from '@mescius/wijmo.angular2.input';

import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';
import { Employee } from '../../models/employee';

interface EmployeeGridRow extends Employee {
  responsibilitiesText: string;
  salaryFormatted: string;
  department?: string;
}

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    EmployeeViewModalComponent,
    WjGridModule,
    WjGridFilterModule,
    WjGridSearchModule,
    WjInputModule,
  ],
  templateUrl: './employee-list.html',
  styleUrls: ['./employee-list.css'],
})
export class EmployeeListComponent implements OnInit, AfterViewInit, OnDestroy {
  employees: EmployeeGridRow[] = [];

  selectedEmployee?: Employee;

  selectedId: number | null = null;

  @ViewChild('flex', { static: false }) flex!: FlexGrid;

  private filter!: FlexGridFilter;
  private destroy$ = new Subject<void>();
  private filterInitialized = false;

  constructor(
    private employeeService: EmployeeService,
    private selectedEmployeeService: SelectedEmployeeService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadEmployees();
  }

  loadEmployees(): void {
    this.employeeService
      .getEmployees()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.employees = list.map((emp) => ({
          ...emp,
          responsibilitiesText: emp.Responsibilities?.map((r) => r.name).join(', ') ?? '',
          salaryFormatted: Number(emp.dailySalary).toFixed(2),
          department: emp.Department?.name,
        }));
        // Explicitly mark for check after async data arrives
        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    // Initialize filter with a small delay to ensure grid is fully rendered with data
    setTimeout(() => {
      if (this.flex && !this.filterInitialized && this.employees.length > 0) {
        this.filter = new FlexGridFilter(this.flex, {
          showFilterIcons: true,
        });
        this.filterInitialized = true;
      }
    }, 100);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  viewEmployee(id: number): void {
    this.employeeService
      .getEmployeeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((emp) => {
        this.selectedEmployee = emp;
        this.selectedId = id;
      });
  }

  closeModal(): void {
    this.selectedEmployee = undefined;
    this.selectedId = null;
  }

  editEmployee(id: number): void {
    this.selectedEmployeeService.setSelected(id);
    this.router.navigate(['/update-employee'], {
      skipLocationChange: true,
    });
  }

  deleteEmployee(id: number): void {
    this.employeeService
      .getEmployeeById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((emp) => {
        if (!emp) return;

        const confirmed = window.confirm(
          `Are you sure you want to delete ${emp.name} ${emp.surname}?`,
        );

        if (confirmed) {
          this.employeeService
            .deleteEmployee(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.loadEmployees();
            });
        }
      });
  }
}
