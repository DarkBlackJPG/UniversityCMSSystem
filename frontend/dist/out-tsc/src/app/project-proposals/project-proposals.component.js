import { __decorate } from "tslib";
import { Component } from '@angular/core';
let ProjectProposalsComponent = class ProjectProposalsComponent {
    constructor(projectsService) {
        this.projectsService = projectsService;
    }
    ngOnInit() {
        this.projectsService.getAllEmployees().subscribe((projects) => {
            this.projects = projects;
        });
    }
};
ProjectProposalsComponent = __decorate([
    Component({
        selector: 'app-project-proposals',
        templateUrl: './project-proposals.component.html',
        styleUrls: ['./project-proposals.component.css']
    })
], ProjectProposalsComponent);
export { ProjectProposalsComponent };
//# sourceMappingURL=project-proposals.component.js.map