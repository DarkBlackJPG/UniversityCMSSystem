import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { AdminEngagementPlanComponent } from './admin-engagement-plan.component';
describe('AdminEngagementPlanComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [AdminEngagementPlanComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AdminEngagementPlanComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=admin-engagement-plan.component.spec.js.map