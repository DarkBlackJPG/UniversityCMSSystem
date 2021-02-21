import { __awaiter } from "tslib";
import { TestBed } from '@angular/core/testing';
import { EmployeeProjectsComponent } from './employee-projects.component';
describe('EmployeeProjectsComponent', () => {
    let component;
    let fixture;
    beforeEach(() => __awaiter(void 0, void 0, void 0, function* () {
        yield TestBed.configureTestingModule({
            declarations: [EmployeeProjectsComponent]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        fixture = TestBed.createComponent(EmployeeProjectsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
//# sourceMappingURL=employee-projects.component.spec.js.map