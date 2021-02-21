import { __decorate } from "tslib";
import { Component } from '@angular/core';
let LandingComponent = class LandingComponent {
    constructor() { }
    ngOnInit() {
        this.showNavigationArrows = true;
        this.showNavigationIndicators = true;
        this.images = [
            "./assets/images/school/school1.jpg",
            "./assets/images/school/school2.jpg",
            "./assets/images/school/school3.jpg",
        ];
    }
};
LandingComponent = __decorate([
    Component({
        selector: 'app-landing',
        templateUrl: './landing.component.html',
        styleUrls: ['./landing.component.css']
    })
], LandingComponent);
export { LandingComponent };
//# sourceMappingURL=landing.component.js.map