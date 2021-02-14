import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminCoursesEditComponent } from './admin-courses-edit.component';

describe('AdminCoursesEditComponent', () => {
  let component: AdminCoursesEditComponent;
  let fixture: ComponentFixture<AdminCoursesEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminCoursesEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminCoursesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
