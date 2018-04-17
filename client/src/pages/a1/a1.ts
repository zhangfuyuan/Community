import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'A1'
})
@Component({
  selector: 'page-a1',
  templateUrl: 'a1.html',
})
export class A1Page {

  pictureId:string;
  curBannerDetail = {
    "bannerId" : "f1523438892222",
    "pictureId" : "ad-2",
    "proposer" : "admin",
    "title" : "这是第一个Banner的标题",
    "content" : "这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容，这是第一个Banner的内容...",
    "sendTime" : "2018-04-01"
  };
  agoDay = '10';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              private toastCtrl: ToastController) {

    this.pictureId = navParams.get('params') || 'ad-2';
    this.getBannerDetail(this.pictureId);
  }

  ionViewDidLoad() {
  }

  getBannerDetail(id) {
    this.http.get('/api/banner', { params: {
      pictureId: id
    } }).subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.curBannerDetail = res.data;
        this.agoDay = Math.floor((Date.now() - new Date(this.curBannerDetail.sendTime).getTime())/86400000) + '';
      } else {
        this.presentToast(res.msg);
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
