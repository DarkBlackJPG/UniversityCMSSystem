import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { DepartmentCoursesComponent } from './department-courses.component';
describe('DepartmentCoursesComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [DepartmentCoursesComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(DepartmentCoursesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=department-courses.component.spec.js.map