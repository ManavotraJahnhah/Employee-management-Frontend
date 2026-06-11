import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DepartmentService } from '../../services/department.service';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';
import { WjGridFilterModule } from '@mescius/wijmo.angular2.grid.filter';
import { WjGridSearchModule } from '@mescius/wijmo.angular2.grid.search';
import { WjInputModule } from '@mescius/wijmo.angular2.input';

import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';

import { Department } from '../../models/Department';
import { DepartmentViewModalComponent } from '../../shared/department-view-modal';
import { SelectedDepartmentService } from '../../services/slected-department.service';

interface DepartmentGridRow extends Department {
  employeeCount: number;
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [CommonModule, WjGridModule, WjGridFilterModule, WjGridSearchModule, WjInputModule, DepartmentViewModalComponent],
  templateUrl: './departments.html',
  styleUrls: ['./departments.css'],
})
export class DepartmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  departments: DepartmentGridRow[] = [];

  selectedDepartment?: Department;
  selectedId: number | null = null;

  @ViewChild('flex', { static: false }) flex!: FlexGrid;

  private filter!: FlexGridFilter;
  private destroy$ = new Subject<void>();
  private filterInitialized = false;

  constructor(
    private departmentService: DepartmentService,
    private selectedDepartmentService: SelectedDepartmentService,
    private router: Router,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadDepartments();
  }

  loadDepartments(): void {
    this.departmentService
      .getDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.departments = list.map((dept: any) => ({
          ...dept,
          employeeCount: dept.Employees?.length ?? 0,
        }));

        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.flex && !this.filterInitialized && this.departments.length > 0) {
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

  viewDepartment(id: number): void {
    this.departmentService
      .getDepartmentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dept) => {
        this.selectedDepartment = dept;
        this.selectedId = id;
      });
  }

  closeModal(): void {
    this.selectedDepartment = undefined;
    this.selectedId = null;
  }

  editDepartment(id: number): void {
    this.selectedDepartmentService.setSelected(id);
    this.router.navigate(['/update-department'], {
      skipLocationChange: true,
    });
  }

  deleteDepartment(id: number): void {
    this.departmentService
      .getDepartmentById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe((dept) => {
        if (!dept) return;

        const confirmed = window.confirm(`Are you sure you want to delete ${dept.name}?`);

        if (confirmed) {
          this.departmentService
            .deleteDepartment(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
              this.loadDepartments();
            });
        }
      });
  }
}
