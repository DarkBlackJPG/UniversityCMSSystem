import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { AdminNotificationsComponent } from './admin-notifications.component';
describe('AdminNotificationsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [AdminNotificationsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AdminNotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=admin-notifications.component.spec.js.map