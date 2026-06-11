import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormlyModule, FormlyFieldConfig, FormlyFormOptions } from '@ngx-formly/core';
import { FormlyBootstrapModule } from '@ngx-formly/bootstrap';

import { ResponsibilityService } from '../../services/responsibility.service';
import { Responsibility } from '../../models/Responsibility';

@Component({
  selector: 'app-responsibility-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormlyModule, FormlyBootstrapModule],
  templateUrl: './responsibility-modal.html',
})
export class ResponsibilityModalComponent implements OnChanges {
  @Input() visible = false;
  @Input() responsibility?: Responsibility | null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  form = new FormGroup({});
  options: FormlyFormOptions = {};

  editing = false;

  model = {
    name: '',
  };

  constructor(private responsibilityService: ResponsibilityService) {}

  ngOnChanges(): void {
    if (this.responsibility && this.responsibility.id) {
      this.editing = true;

      this.model = {
        name: this.responsibility.name,
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
        label: 'Responsibility Name',
        placeholder: 'Enter responsibility name',
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

    if (this.editing && this.responsibility?.id) {
      this.responsibilityService
        .updateResponsibility(this.responsibility.id, payload)
        .subscribe(() => this.afterSave());
    } else {
      this.responsibilityService.createResponsibility(payload).subscribe(() => this.afterSave());
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
