import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeeCourseNotificationsComponent } from './employee-course-notifications.component';
describe('EmployeeCourseNotificationsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeeCourseNotificationsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeCourseNotificationsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employee-course-notifications.component.spec.js.map