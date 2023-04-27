import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class UserServiceService {
  constructor(private webReqService: WebRequestService) {}

  createUser(email: String, password: String, nickName: String) {
    return this.webReqService.post('users', { email, password, nickName });
  }

  login(user: object) {
    return this.webReqService.post('login', user);
  }
}
