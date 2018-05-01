import { Injectable } from '@angular/core';

@Injectable()
export class GlobalDataProvider {

  private _userInfo = null;
  private _newMsgNum = 0;

  constructor() {
  }

  get userInfo() {
    return this._userInfo;
  }

  set userInfo(value) {
    this._userInfo = value;
  }

  get newMsgNum() {
    return this._newMsgNum;
  }

  set newMsgNum(value) {
    this._newMsgNum = value;
  }

  logout() {
    this._userInfo = null;
    this._newMsgNum = 0;
  }
}
