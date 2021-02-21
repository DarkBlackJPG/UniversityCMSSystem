import { TestBed } from '@angular/core/testing';
import { NotificationService } from './notification.service';
describe('NotificationService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(NotificationService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=notification.service.spec.js.map