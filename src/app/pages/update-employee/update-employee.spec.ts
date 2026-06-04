import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UpdateEmployeeComponent } from './update-employee';

// Tests unitaires pour UpdateEmployeeComponent : vérifie que le composant se crée
describe('UpdateEmployeeComponent', () => {
  let component: UpdateEmployeeComponent;
  let fixture: ComponentFixture<UpdateEmployeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateEmployeeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UpdateEmployeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
