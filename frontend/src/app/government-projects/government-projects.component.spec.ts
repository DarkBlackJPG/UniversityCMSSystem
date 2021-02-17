import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GovernmentProjectsComponent } from './government-projects.component';

describe('GovernmentProjectsComponent', () => {
  let component: GovernmentProjectsComponent;
  let fixture: ComponentFixture<GovernmentProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GovernmentProjectsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GovernmentProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
