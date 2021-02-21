import { TestBed } from '@angular/core/testing';
import { EmployeeService } from './employee.service';
describe('EmployeeService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(EmployeeService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=employee.service.spec.js.map