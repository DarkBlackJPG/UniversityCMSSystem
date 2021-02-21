import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { GovernmentProjectsComponent } from './government-projects.component';
describe('GovernmentProjectsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [GovernmentProjectsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(GovernmentProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=government-projects.component.spec.js.map