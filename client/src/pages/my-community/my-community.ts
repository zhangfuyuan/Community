import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, ToastController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'MyCommunity'
})
@Component({
  selector: 'page-my-community',
  templateUrl: 'my-community.html',
})
export class MyCommunityPage {

  pet: string = "公告";
  msgNum = 2;
  isLogin: boolean = false;
  noticeItems = [];
  newsItems = [
    {
      "newsId" : "i1523431416111",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "新闻标题1",
      "content" : "社区*的第一条新闻，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }, {
      "newsId" : "i1523431416222",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "新闻标题2",
      "content" : "社区*的第二条新闻，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }, {
      "newsId" : "i1523431416333",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "新闻标题3",
      "content" : "社区*的第三条新闻，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }
  ];
  payItems = [
    {
      "payId" : "j1523431416111",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "缴费标题1",
      "content" : "社区*的第一条缴费通知，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }, {
      "payId" : "j1523431416222",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "缴费标题2",
      "content" : "社区*的第二条缴费通知，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }, {
      "payId" : "j1523431416333",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "缴费标题3",
      "content" : "社区*的第三条缴费通知，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区*"
    }
  ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              private global: GlobalDataProvider,
              private http: Http,
              public events: Events,
              private toastCtrl: ToastController) {

    events.subscribe('login', (userInfo) => {
      this.isLogin = true;
      this.getNoticeItems(userInfo.community);
    });
    events.subscribe('logout', () => {
      this.isLogin = false;
      this.msgNum = 0;
      this.noticeItems = [];
    });
    events.subscribe('getNewMsg', (msgLen) => { this.msgNum = msgLen; });
    events.subscribe('readNewMsg', () => { this.msgNum = 0; });
    events.subscribe('getNewNotice', (action, notice) => {
      switch (action) {
        case 'add':
          this.noticeItems.push(notice);
          break;

        case 'remove':
          let noticeIndex;

          this.noticeItems.map((item, index)=>{
            if (item.noticeId === notice.noticeId) noticeIndex = index;
          });
          this.noticeItems.splice(noticeIndex, 1);
          break;

        case 'edit':
          this.noticeItems = this.noticeItems.map((item)=>{
            return item.noticeId === notice.noticeId ? notice : item;
          });
          break;
      }
    });
    this.msgNum = global.newMsgNum;

    if (global.userInfo) {
      this.isLogin = true;
      this.getNoticeItems(global.userInfo.community);
    }
  }

  ionViewDidLoad() {
    if (this.global) return;
  }

  getNoticeItems(community) {
    this.http.get('/api/notice', { params: {
      community: community
    } }).subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.noticeItems = res.data;
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  switchPage(page, params) {
    if (!this.isLogin)  return this.app.getRootNav().push('Entry');

    this.app.getRootNav().push(page, {
      params: params
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000,
      position: 'middle',
      cssClass: 'my-toast'
    });

    toast.present();
  }

  ngOnDestroy() {
    this.events.unsubscribe('login');
    this.events.unsubscribe('logout');
    this.events.unsubscribe('getNewMsg');
    this.events.unsubscribe('getNewNotice');
    this.events.unsubscribe('readNewMsg');
  }
}
