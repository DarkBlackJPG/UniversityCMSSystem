import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMyCoursesComponent } from './employee-my-courses.component';

describe('EmployeeMyCoursesComponent', () => {
  let component: EmployeeMyCoursesComponent;
  let fixture: ComponentFixture<EmployeeMyCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeMyCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMyCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
