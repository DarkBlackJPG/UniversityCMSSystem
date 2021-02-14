import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminEngagementPlanComponent } from './admin-engagement-plan.component';

describe('AdminEngagementPlanComponent', () => {
  let component: AdminEngagementPlanComponent;
  let fixture: ComponentFixture<AdminEngagementPlanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminEngagementPlanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminEngagementPlanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
