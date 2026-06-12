import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/Department';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';
import { WjGridFilterModule } from '@mescius/wijmo.angular2.grid.filter';
import { WjGridSearchModule } from '@mescius/wijmo.angular2.grid.search';
import { WjInputModule } from '@mescius/wijmo.angular2.input';

import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';

import { DepartmentModalComponent } from '../department-modal/department-modal';

interface DepartmentGridRow extends Department {
  employeeCount: number;
}

@Component({
  selector: 'app-department-list',
  standalone: true,
  imports: [
    CommonModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridSearchModule,
    WjInputModule,
    DepartmentModalComponent,
  ],
  templateUrl: './departments.html',
  styleUrls: ['./departments.css'],
})
export class DepartmentListComponent implements OnInit, AfterViewInit, OnDestroy {
  departments: DepartmentGridRow[] = [];

  modalOpen = false;
  selectedDepartment: Department | null = null;

  @ViewChild('flex', { static: false }) flex!: FlexGrid;

  private destroy$ = new Subject<void>();
  private filterInitialized = false;
  private filter!: FlexGridFilter;

  constructor(
    private departmentService: DepartmentService,
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

  // ✅ SINGLE ENTRY POINT (fixes double click issue)
  private openModal(dept: Department | null): void {
    this.selectedDepartment = dept;
    this.modalOpen = true;
  }

  // VIEW
  viewDepartment(id: number): void {
    this.departmentService.getDepartmentById(id).subscribe((dept) => {
      this.openModal(dept);
      this.cdr.detectChanges();
    });
  }

  // CREATE
  openCreateModal(): void {
    this.openModal(null);
  }

  // EDIT
  editDepartment(id: number): void {
    this.departmentService.getDepartmentById(id).subscribe((dept) => {
      this.openModal(dept);
      this.cdr.detectChanges();
    });
  }

  // CLOSE
  closeModal(): void {
    this.modalOpen = false;
    this.selectedDepartment = null;
  }

  // RELOAD
  reloadDepartments(): void {
    this.loadDepartments();
  }

  // DELETE
  deleteDepartment(id: number): void {
    this.departmentService.getDepartmentById(id).subscribe((dept) => {
      if (!dept) return;

      const confirmed = window.confirm(`Are you sure you want to delete ${dept.name}?`);

      if (confirmed) {
        this.departmentService.deleteDepartment(id).subscribe(() => {
          this.loadDepartments();
        });
      }
    });
  }
}
