import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, Events } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'C1'
})
@Component({
  selector: 'page-c1',
  templateUrl: 'c1.html',
})
export class C1Page {

  pet: string = "Banner列表";
  bannerItems = [
    {
      "bannerId" : "f1523438892222",
      "pictureId" : "ad-2",
      "proposer" : "admin",
      "title" : "这是第一个Banner的标题",
      "content" : "这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容...",
      "sendTime" : "2018-04-01",
      agoDay: '10'
    }, {
      "bannerId" : "f1523438892333",
      "pictureId" : "ad-3",
      "proposer" : "admin",
      "title" : "这是第二个Banner的标题",
      "content" : "这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容，这是第二个Banner的内容...",
      "sendTime" : "2018-04-01",
      agoDay: '10'
    }
  ];
  form = {
    "bannerId" : "f1523438892222",
    "pictureId" : "ad-2",
    "proposer" : "admin",
    "title" : "这是第一个Banner的标题",
    "content" : "这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容...",
    "sendTime" : "2018-04-01"
  };
  curBannerIndex = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              private toastCtrl: ToastController,
              public events: Events) {

    this.getBanners();
  }

  ionViewDidLoad() {
  }

  getBanners() {
    this.http.get('/api/bannerItems').subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.bannerItems = res.data;
        this.bannerItems.forEach(function (item) {
          item.agoDay = Math.floor((Date.now() - new Date(item.sendTime).getTime())/86400000) + '';
        })
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  editDetail(index, curBanner) {
    this.form = curBanner;
    this.pet = "Banner操作";
    this.curBannerIndex = index;
  }

  postDetail() {
    this.http.post('/api/edit_banner', { detail: {
      bannerId: this.form.bannerId,
      pictureId: this.form.pictureId,
      proposer: this.form.proposer,
      title: this.form.title,
      content: this.form.content,
      sendTime: new Date()['format']('yyyy-MM-dd')
    } }).subscribe((response: Response) => {
      let res = response.json();

      this.presentToast(res.msg);

      if (res.status === 200) {
        this.bannerItems[this.curBannerIndex] = res.data;
        this.bannerItems[this.curBannerIndex].agoDay = Math.floor((Date.now() - new Date(res.data.sendTime).getTime())/86400000) + '';
        this.pet = "Banner列表";
        this.events.publish('getNewBanner', this.curBannerIndex, res.data);
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
