import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { DepartmentService } from '../../services/department.service';
import { Department } from '../../models/Department';

@Component({
  selector: 'app-department-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyBootstrapModule],
  templateUrl: './department-modal.html',
})
export class DepartmentModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() department?: Department | null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form = new FormGroup({});
  options: FormlyFormOptions = {};

  editing = false;

  model = {
    name: '',
  };

  constructor(private departmentService: DepartmentService) {}

  ngOnChanges(): void {
    if (this.department && this.department.id) {
      this.editing = true;

      this.model = {
        name: this.department.name,
      };
    } else {
      this.editing = false;

      this.model = {
        name: '',
      };
    }
  }

  fields: FormlyFieldConfig[] = [
    {
      key: 'name',
      type: 'input',
      props: {
        label: 'Department Name',
        placeholder: 'Enter department name',
        required: true,
      },
    },
  ];

  save(): void {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.model;

    if (this.editing && this.department?.id) {
      this.departmentService
        .updateDepartment(this.department.id, payload)
        .subscribe(() => this.afterSave());
    } else {
      this.departmentService.createDepartment(payload).subscribe(() => this.afterSave());
    }
  }

  private afterSave(): void {
    this.saved.emit();
    this.close();
  }

  close(): void {
    this.closeModal.emit();
  }
}
