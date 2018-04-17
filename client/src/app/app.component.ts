import { Component } from '@angular/core';
import { Platform, Events, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../providers/global-data/global-data';
import { Storage } from '@ionic/storage';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = 'Tabs';

  constructor(platform: Platform, statusBar: StatusBar,
              splashScreen: SplashScreen,
              private http: Http,
              private global: GlobalDataProvider,
              public events: Events,
              private toastCtrl: ToastController,
              private storage: Storage) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      this.checkToken();
      events.subscribe('login', (userInfo) => { this.getNewMsg(userInfo); });
    });
  }

  checkToken() {
    this.http.get('/api/users/check_token').subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.global.userInfo = res.data;
        this.getNewMsg(res.data);
      } else {
        this.global.userInfo = null;
      }
    });
  }

  getNewMsg(userInfo) {
    this.storage.get('msgItems').then((val) => {
      let msgItems = val ? JSON.parse(val) : [],
        noticeItems = [],
        workOrderItems = [],
        noticeUnique = [],
        workOrderUnique = [];

      msgItems.map((item)=>{
        if (item.hasOwnProperty('noticeId') && noticeUnique.indexOf(item.noticeId) === -1) {
          noticeUnique.push(item.noticeId);
          noticeItems.push(item.noticeId);
        }

        if (item.hasOwnProperty('workOrderId') && workOrderUnique.indexOf(item.workOrderId) === -1) {
          workOrderUnique.push(item.workOrderId);
          workOrderItems.push({
            workOrderId: item.workOrderId,
            status: item.status
          })
        } else if (item.hasOwnProperty('workOrderId') && workOrderUnique.indexOf(item.workOrderId) > -1) {
          workOrderItems[workOrderUnique.indexOf(item.workOrderId)].status = item.status;
        }
      });

      this.http.post('/api/new_msg', {
        username: userInfo['username'],
        community: userInfo['community'],
        noticeItems: noticeItems,
        workOrderItems: workOrderItems
      }).subscribe((response: Response) => {
        let res = response.json();

        if (res.status === 200) {
          let newMsgItems = res.data, newMsgObj, newMsgLen = 0;

          if (newMsgItems.length > 0) {
            newMsgItems.map((item)=>{
              newMsgObj = item;
              newMsgObj['isRead'] = false;
              msgItems.push(newMsgObj);
            });
            this.storage.set('msgItems', JSON.stringify(msgItems));

          }

          msgItems.map((item)=>{
            if (!item.isRead) {
              if ((userInfo['identity'] === 'user' && !item.hasOwnProperty('proposer')) ||
                (userInfo['identity'] === 'user' && item.hasOwnProperty('proposer') && item.proposer === userInfo['username']) ||
                (userInfo['identity'] !== 'user' && item.hasOwnProperty('proposer'))) {
                newMsgLen++;
              }
            }
          });
          this.global.newMsgNum = newMsgLen;
          this.events.publish('getNewMsg', newMsgLen);
        } else {
          this.presentToast(res.msg);
        }
      });
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2500,
      position: 'middle',
      cssClass: 'my-toast'
    });

    toast.present();
  }
}

Date.prototype['format'] = function(fmt) {
  let o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    "S": this.getMilliseconds() //毫秒
  };

  if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));

  for (let k in o)
    if (new RegExp("(" + k + ")").test(fmt))
      fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));

  return fmt;
};
