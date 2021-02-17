import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeCourseNotificationsComponent } from './employee-course-notifications.component';

describe('EmployeeCourseNotificationsComponent', () => {
  let component: EmployeeCourseNotificationsComponent;
  let fixture: ComponentFixture<EmployeeCourseNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeCourseNotificationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeCourseNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
