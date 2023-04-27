import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginStatusService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  setLoginStatus(isLoggedIn: boolean) {
    this.isLoggedInSubject.next(isLoggedIn);
  }
}
