import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { AdminViewAccountsComponent } from './admin-view-accounts.component';
describe('AdminViewAccountsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [AdminViewAccountsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AdminViewAccountsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=admin-view-accounts.component.spec.js.map