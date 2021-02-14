import { TestBed } from '@angular/core/testing';

import { AdministratorFunctionsService } from './administrator-functions.service';

describe('AdministratorFunctionsService', () => {
  let service: AdministratorFunctionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministratorFunctionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
