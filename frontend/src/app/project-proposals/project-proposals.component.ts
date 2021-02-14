import { Component, OnInit } from '@angular/core';
import {ProjectsService} from "../services/projects.service";
import {ProjectProposal} from "../models/database/ProjectProposal";

@Component({
  selector: 'app-project-proposals',
  templateUrl: './project-proposals.component.html',
  styleUrls: ['./project-proposals.component.css']
})
export class ProjectProposalsComponent implements OnInit {
  projects: ProjectProposal[];
  constructor(private projectsService: ProjectsService) { }

  ngOnInit(): void {
    this.projectsService.getAllEmployees().subscribe((projects:ProjectProposal[]) => {
      this.projects = projects;
    });
  }



}
