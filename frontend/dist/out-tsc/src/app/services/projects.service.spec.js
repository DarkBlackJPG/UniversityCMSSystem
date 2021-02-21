import { TestBed } from '@angular/core/testing';
import { ProjectsService } from './projects.service';
describe('ProjectsService', () => {
    let service;
    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(ProjectsService);
    });
    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=projects.service.spec.js.map