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

import { ResponsibilityService } from '../../services/responsibility.service';
import { Responsibility } from '../../models/Responsibility';

import { WjGridModule } from '@mescius/wijmo.angular2.grid';
import { WjGridFilterModule } from '@mescius/wijmo.angular2.grid.filter';
import { WjGridSearchModule } from '@mescius/wijmo.angular2.grid.search';
import { WjInputModule } from '@mescius/wijmo.angular2.input';

import { FlexGrid } from '@mescius/wijmo.grid';
import { FlexGridFilter } from '@mescius/wijmo.grid.filter';

import { ResponsibilityModalComponent } from '../responsibility-modal/responsibility-modal';

interface ResponsibilityGridRow extends Responsibility {
  employeeCount: number;
}

@Component({
  selector: 'app-responsibility-list',
  standalone: true,
  imports: [
    CommonModule,
    WjGridModule,
    WjGridFilterModule,
    WjGridSearchModule,
    WjInputModule,
    ResponsibilityModalComponent,
  ],
  templateUrl: './responsibilities.html',
  styleUrls: ['./responsibilities.css'],
})
export class ResponsibilityListComponent implements OnInit, AfterViewInit, OnDestroy {
  responsibilities: ResponsibilityGridRow[] = [];

  modalOpen = false;
  selectedResponsibility: Responsibility | null = null;

  @ViewChild('flex', { static: false }) flex!: FlexGrid;

  private destroy$ = new Subject<void>();
  private filterInitialized = false;
  private filter!: FlexGridFilter;

  constructor(
    private responsibilityService: ResponsibilityService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadResponsibilities();
  }

  loadResponsibilities(): void {
    this.responsibilityService
      .getResponsibilities()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.responsibilities = list.map((resp: any) => ({
          ...resp,
          employeeCount: resp.Employees?.length ?? 0,
        }));

        this.cdr.markForCheck();
      });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      if (this.flex && !this.filterInitialized && this.responsibilities.length > 0) {
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
  private openModal(resp: Responsibility | null): void {
    this.selectedResponsibility = resp;
    this.modalOpen = true;
  }

  // VIEW
  viewResponsibility(id: number): void {
    this.responsibilityService.getResponsibilityById(id).subscribe((resp) => {
      this.openModal(resp);
      this.cdr.detectChanges();
    });
  }

  // CREATE
  openCreateModal(): void {
    this.openModal(null);
  }

  // EDIT
  editResponsibility(id: number): void {
    this.responsibilityService.getResponsibilityById(id).subscribe((resp) => {
      this.openModal(resp);
      this.cdr.detectChanges();
    });
  }

  // CLOSE
  closeModal(): void {
    this.modalOpen = false;
    this.selectedResponsibility = null;
  }

  // RELOAD
  reloadResponsibilities(): void {
    this.loadResponsibilities();
  }

  // DELETE
  deleteResponsibility(id: number): void {
    this.responsibilityService.getResponsibilityById(id).subscribe((resp) => {
      if (!resp) return;

      const confirmed = window.confirm(`Are you sure you want to delete ${resp.name}?`);

      if (confirmed) {
        this.responsibilityService.deleteResponsibility(id).subscribe(() => {
          this.loadResponsibilities();
        });
      }
    });
  }
}
