import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeeMyCoursesComponent } from './employee-my-courses.component';
describe('EmployeeMyCoursesComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeeMyCoursesComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeMyCoursesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employee-my-courses.component.spec.js.map