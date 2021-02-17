import { Injectable } from '@angular/core';
import {Observable} from "rxjs/internal/Observable";
import { of } from "rxjs/internal/observable/of";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserValidationServiceService {
  public isOpen$ = new BehaviorSubject(false);
  constructor() { }

  public toggle(): void {
    this.isOpen$.next(!this.isOpen$.getValue());
  }
  public setOpen(value: boolean): void {
    this.isOpen$.next(value);
  }
  public getIsOpen(): Observable<boolean> {
    return this.isOpen$;
  }
  refreshValidation() {

  }
}
