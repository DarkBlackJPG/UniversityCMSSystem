import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class UserValidationServiceService {
  public isOpen$ = new BehaviorSubject(false);

  constructor(private router: Router,) { }

  public toggle(): void {
    this.isOpen$.next(!this.isOpen$.getValue());
  }
  public setOpen(value: boolean): void {
    this.isOpen$.next(value);
  }
  public getIsOpen(): Observable<boolean> {
    return this.isOpen$;
  }

  logout(path: string = null) {
    if(path === null) {
      path = '';
    }
    localStorage.removeItem('session');
    this.setOpen(false);
    this.setOpen(true);
    this.router.navigate([path]);
  }
}
