import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {Page} from "./PageEnum";

@Injectable({
  providedIn: 'root'
})

export class NavigationService {
  private currentPage = new BehaviorSubject<Page>(Page.LANDING);

  constructor() { }

  public getObserver() {
    return this.currentPage;
  }
  public setPageValue(val: Page) {
    this.currentPage.next(val);
  }
}
