import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibilityModal } from './responsibility-modal';

describe('ResponsibilityModal', () => {
  let component: ResponsibilityModal;
  let fixture: ComponentFixture<ResponsibilityModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibilityModal],
    }).compileComponents();

    fixture = TestBed.createComponent(ResponsibilityModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
