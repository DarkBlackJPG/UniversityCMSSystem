import { TestBed } from '@angular/core/testing';
import { UploadServiceService } from './upload-service.service';
describe('UploadServiceService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(UploadServiceService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=upload-service.service.spec.js.map