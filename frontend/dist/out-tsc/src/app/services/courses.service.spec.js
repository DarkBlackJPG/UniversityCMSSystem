import { TestBed } from '@angular/core/testing';
import { CoursesService } from './courses.service';
describe('CoursesService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(CoursesService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=courses.service.spec.js.map