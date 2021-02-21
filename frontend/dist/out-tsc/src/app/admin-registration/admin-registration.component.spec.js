import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { AdminRegistrationComponent } from './admin-registration.component';
describe('AdminRegistrationComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [AdminRegistrationComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AdminRegistrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=admin-registration.component.spec.js.map