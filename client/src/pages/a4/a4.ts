import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'A4'
})
@Component({
  selector: 'page-a4',
  templateUrl: 'a4.html',
})
export class A4Page {

  msgItems = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private global: GlobalDataProvider,
              private storage: Storage,
              public events: Events) {

    storage.get('msgItems').then((val) => {
      let msgItems = val ? JSON.parse(val) : [];

      msgItems = msgItems.map((item)=>{
        if ((global.userInfo['identity'] === 'user' && !item.hasOwnProperty('proposer')) ||
          (global.userInfo['identity'] === 'user' && item.hasOwnProperty('proposer') && item.proposer === global.userInfo['username']) ||
          (global.userInfo['identity'] !== 'user' && item.hasOwnProperty('proposer'))) {
          this.msgItems.unshift(JSON.parse(JSON.stringify(item)));
        }

        item.isRead = true;
        return item;
      });

      if (msgItems.length > 0 && global.newMsgNum > 0) {
        storage.set('msgItems', JSON.stringify(msgItems));
        global.newMsgNum = 0;
      }

      events.publish('readNewMsg');
    });
  }

  ionViewDidLoad() {
    if (this.global && this.storage) return;
  }
}
