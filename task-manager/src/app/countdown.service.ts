import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountdownService {
  private countdownDisplaySource = new Subject<string>();
  countdownDisplay$ = this.countdownDisplaySource.asObservable();

  updateCountdownDisplay(countdownDisplay: string) {
    this.countdownDisplaySource.next(countdownDisplay);
  }
}
