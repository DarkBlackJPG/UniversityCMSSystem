import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeeStudentRegistrationListComponent } from './employee-student-registration-list.component';
describe('EmployeeStudentRegistrationListComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeeStudentRegistrationListComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeStudentRegistrationListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employee-student-registration-list.component.spec.js.map