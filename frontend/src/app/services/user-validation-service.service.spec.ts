import { TestBed } from '@angular/core/testing';

import { UserValidationServiceService } from './user-validation-service.service';

describe('UserValidationServiceService', () => {
  let service: UserValidationServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserValidationServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
