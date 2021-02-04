import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentCoursesComponent } from './department-courses.component';

describe('DepartmentCoursesComponent', () => {
  let component: DepartmentCoursesComponent;
  let fixture: ComponentFixture<DepartmentCoursesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepartmentCoursesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentCoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
