import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPasswordChangeComponent } from './student-password-change.component';

describe('StudentPasswordChangeComponent', () => {
  let component: StudentPasswordChangeComponent;
  let fixture: ComponentFixture<StudentPasswordChangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPasswordChangeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPasswordChangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
