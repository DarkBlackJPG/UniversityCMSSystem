import { TestBed } from '@angular/core/testing';
import { UserValidationServiceService } from './user-validation-service.service';
describe('UserValidationServiceService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UserValidationServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=user-validation-service.service.spec.js.map