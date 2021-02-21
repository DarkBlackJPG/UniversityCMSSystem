import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { AdminCoursesEditComponent } from './admin-courses-edit.component';
describe('AdminCoursesEditComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [AdminCoursesEditComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(AdminCoursesEditComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=admin-courses-edit.component.spec.js.map