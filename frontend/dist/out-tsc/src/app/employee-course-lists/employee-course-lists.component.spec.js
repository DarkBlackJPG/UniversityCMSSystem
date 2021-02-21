import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeeCourseListsComponent } from './employee-course-lists.component';
describe('EmployeeCourseListsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeeCourseListsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeCourseListsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employee-course-lists.component.spec.js.map