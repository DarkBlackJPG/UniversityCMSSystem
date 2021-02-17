import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeProjectsComponent } from './employee-projects.component';

describe('EmployeeProjectsComponent', () => {
  let component: EmployeeProjectsComponent;
  let fixture: ComponentFixture<EmployeeProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmployeeProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
