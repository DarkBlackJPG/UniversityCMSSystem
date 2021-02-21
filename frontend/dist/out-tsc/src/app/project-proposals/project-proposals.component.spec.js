import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { ProjectProposalsComponent } from './project-proposals.component';
describe('ProjectProposalsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [ProjectProposalsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(ProjectProposalsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=project-proposals.component.spec.js.map