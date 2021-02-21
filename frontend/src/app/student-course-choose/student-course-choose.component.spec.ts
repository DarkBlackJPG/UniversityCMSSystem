import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentCourseChooseComponent } from './student-course-choose.component';

describe('StudentCourseChooseComponent', () => {
  let component: StudentCourseChooseComponent;
  let fixture: ComponentFixture<StudentCourseChooseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentCourseChooseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentCourseChooseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
