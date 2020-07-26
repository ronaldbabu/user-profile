import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  userinfo = {};
  private userData = new BehaviorSubject(this.userinfo);
  userVal = this.userData.asObservable();

  constructor() { }

  getUserData(userinfo: string) {
    this.userData.next(userinfo);
  }

}
