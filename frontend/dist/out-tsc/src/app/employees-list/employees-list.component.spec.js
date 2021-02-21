import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeesListComponent } from './employees-list.component';
describe('EmployeesListComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeesListComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeesListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employees-list.component.spec.js.map