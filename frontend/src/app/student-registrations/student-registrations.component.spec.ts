import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRegistrationsComponent } from './student-registrations.component';

describe('StudentRegistrationsComponent', () => {
  let component: StudentRegistrationsComponent;
  let fixture: ComponentFixture<StudentRegistrationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentRegistrationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentRegistrationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
