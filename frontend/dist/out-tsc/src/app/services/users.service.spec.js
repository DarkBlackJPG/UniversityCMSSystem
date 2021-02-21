import { TestBed } from '@angular/core/testing';
import { UsersService } from './users.service';
describe('UsersService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UsersService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=users.service.spec.js.map