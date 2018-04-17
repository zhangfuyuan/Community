import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController, Events } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'A2'
})
@Component({
  selector: 'page-a2',
  templateUrl: 'a2.html',
})
export class A2Page {

  pet: string = '公告详情';
  curNoticeDetail;
  form;
  agoDay;
  action: string = 'edit';
  isChoose = true;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public events: Events) {

    this.curNoticeDetail = navParams.get('params') || {
      "noticeId" : "c1523431416388",
      "sendTime" : "2018-04-01 09:00",
      "publisher" : "物业",
      "title" : "我要告诉大家这是什么",
      "content" : "社区1的一条公告，这真是一条大家都要知道的通知，究竟是什么呢？敬请期待...",
      "picture" : "http://localhost:3000/public/images/swiper01.jpg",
      "community" : "社区1"
    };
    this.form = {
      noticeId: this.curNoticeDetail['noticeId'],
      sendTime: this.curNoticeDetail['sendTime'],
      publisher: this.curNoticeDetail['publisher'],
      title: this.curNoticeDetail['title'],
      content: this.curNoticeDetail['content'],
      picture: this.curNoticeDetail['picture'],
      community: this.curNoticeDetail['community']
    };
    this.agoDay = Math.floor((Date.now() - new Date(this.curNoticeDetail.sendTime).getTime())/86400000) + '';
  }

  ionViewDidLoad() {
  }

  changeAction(action) {
    switch (action) {
      case 'add':
        this.action = 'add';
        this.form = {
          noticeId: 'c' + Date.now(),
          sendTime: '',
          publisher: '物业',
          title: '无',
          content: '无',
          picture: 'http://localhost:3000/public/images/swiper01.jpg',
          community: this.global.userInfo.community
        };
        this.pet = '公告管理';
        this.isChoose = false;
        break;

      case 'remove':
        if (!this.curNoticeDetail) return this.presentToast('暂无公告可删除！');

        this.action = 'remove';
        this.isChoose = true;
        let confirm = this.alertCtrl.create({
          title: '警告',
          message: '确定要删除此条社区公告?',
          buttons: [
            {
              text: '取消',
              handler: () => {
                this.action = 'edit';
              }
            },
            {
              text: '确定',
              handler: () => {
                this.postDetail('remove');
              }
            }
          ]
        });
        confirm.present();
        break;

      case 'edit':
        if (!this.curNoticeDetail) return this.presentToast('暂无公告可修改！');

        this.action = 'edit';
        this.pet = '公告管理';
        this.isChoose = true;
        break;
    }
  }

  postDetail(post) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/' + post + '_notice', { detail: {
      noticeId: this.form.noticeId,
      sendTime: new Date()['format']('yyyy-MM-dd hh:mm'),
      publisher: this.form.publisher,
      title: this.form.title,
      content: this.form.content,
      picture: this.form.picture,
      community: this.form.community
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.events.publish('getNewNotice', this.action, res.data);

        if (this.action === 'remove') {
          this.curNoticeDetail = null;
          this.action = 'add';
          this.form = {
            noticeId: 'c' + Date.now(),
            sendTime: '',
            publisher: '物业',
            title: '无',
            content: '无',
            picture: 'http://localhost:3000/public/images/swiper01.jpg',
            community: this.global.userInfo.community
          };
        } else {
          this.curNoticeDetail = res.data;
          this.agoDay = Math.floor((Date.now() - new Date(this.curNoticeDetail.sendTime).getTime())/86400000) + '';
          this.isChoose = true;
          this.pet = "公告详情";
          this.action = 'edit';
        }
      }
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

}
