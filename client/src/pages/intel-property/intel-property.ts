import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events } from 'ionic-angular';

import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'IntelProperty'
})
@Component({
  selector: 'page-intel-property',
  templateUrl: 'intel-property.html',
})
export class IntelPropertyPage {

  msgNum = 2;
  isLogin: boolean = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              public events: Events,
              private global: GlobalDataProvider) {

    events.subscribe('login', () => { this.isLogin = true; });
    events.subscribe('logout', () => {
      this.isLogin = false;
      this.msgNum = 0;
    });
    events.subscribe('getNewMsg', (msgLen) => { this.msgNum = msgLen; });
    events.subscribe('readNewMsg', () => { this.msgNum = 0; });
    this.msgNum = global.newMsgNum;

    if (global.userInfo) this.isLogin = true;
  }

  ionViewDidLoad() {
    if (this.global) return;
  }

  switchPage(page) {
    if (page === 'B8') return this.app.getRootNav().push('B8');

    if (!this.isLogin)  return this.app.getRootNav().push('Entry');

    this.app.getRootNav().push(page);
  }

  ngOnDestroy() {
    this.events.unsubscribe('login');
    this.events.unsubscribe('logout');
    this.events.unsubscribe('getNewMsg');
    this.events.unsubscribe('readNewMsg');
  }
}
