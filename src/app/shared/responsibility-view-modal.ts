import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Responsibility } from '../models/Responsibility';

@Component({
  selector: 'app-responsibility-view-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modal-backdrop fade show"></div>
    <div class="modal d-block" tabindex="-1" role="dialog">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Responsibility Details</h5>
            <button
              type="button"
              class="btn-close"
              aria-label="Close"
              (click)="close.emit()"
            ></button>
          </div>
          <div class="modal-body">
            <dl class="row">
              <dt class="col-sm-4">Name</dt>
              <dd class="col-sm-8">{{ responsibility?.name }}</dd>
            </dl>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="close.emit()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class ResponsibilityViewModalComponent {
  @Input() responsibility?: Responsibility;
  @Output() close = new EventEmitter<void>();
}
