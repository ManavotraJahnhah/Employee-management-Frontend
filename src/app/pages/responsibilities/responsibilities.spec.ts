import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Responsibilities } from './responsibilities';

describe('Responsibilities', () => {
  let component: Responsibilities;
  let fixture: ComponentFixture<Responsibilities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Responsibilities],
    }).compileComponents();

    fixture = TestBed.createComponent(Responsibilities);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
