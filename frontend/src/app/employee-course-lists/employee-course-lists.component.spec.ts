import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCourseListsComponent } from './employee-course-lists.component';

describe('EmployeeCourseListsComponent', () => {
  let component: EmployeeCourseListsComponent;
  let fixture: ComponentFixture<EmployeeCourseListsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCourseListsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCourseListsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
