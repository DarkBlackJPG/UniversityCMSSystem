import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css']
})
export class LandingComponent implements OnInit {
  images: string[];
  showNavigationArrows: boolean;
  showNavigationIndicators: boolean;
  constructor() { }

  ngOnInit(): void {
    this.showNavigationArrows = true;
    this.showNavigationIndicators = true;
    this.images = [
      "./assets/images/school/school1.jpg",
      "./assets/images/school/school2.jpg",
      "./assets/images/school/school3.jpg",
    ]
  }

}
