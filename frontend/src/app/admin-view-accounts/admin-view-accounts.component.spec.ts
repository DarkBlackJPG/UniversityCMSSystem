import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminViewAccountsComponent } from './admin-view-accounts.component';

describe('AdminViewAccountsComponent', () => {
  let component: AdminViewAccountsComponent;
  let fixture: ComponentFixture<AdminViewAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminViewAccountsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminViewAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
