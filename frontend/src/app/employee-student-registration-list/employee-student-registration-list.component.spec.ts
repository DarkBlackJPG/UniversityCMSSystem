import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeStudentRegistrationListComponent } from './employee-student-registration-list.component';

describe('EmployeeStudentRegistrationListComponent', () => {
  let component: EmployeeStudentRegistrationListComponent;
  let fixture: ComponentFixture<EmployeeStudentRegistrationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeStudentRegistrationListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeStudentRegistrationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
