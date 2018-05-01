import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'C5'
})
@Component({
  selector: 'page-c5',
  templateUrl: 'c5.html',
})
export class C5Page {

  pet: string = "导入列表";
  addUserItems = [];
  form = {
    userid: 'a' + Date.now(),
    username: '',
    nickname: '',
    password: '123456',
    identity: '',
    community: '',
    remark: ''
  };
  communityNameItems = [ "社区1", "社区2", "社区3" ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

    this.getCommunityNameItems();
  }

  ionViewDidLoad() {
  }

  getCommunityNameItems() {
    this.http.get('/api/community').subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.communityNameItems = res.data.map(item => item.name);
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  postDetail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.http.post('/api/users/add_user', { detail: {
      userid: this.form.userid,
      username: this.form.username.trim(),
      nickname: this.form.nickname.trim(),
      password: this.form.password.trim(),
      identity: this.form.identity,
      community: this.form.community,
      remark: this.form.remark
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.addUserItems.unshift(res.data);
        this.pet = '导入列表';
        this.form = {
          userid: 'a' + Date.now(),
          username: '',
          nickname: '',
          password: '123456',
          identity: '',
          community: '',
          remark: ''
        };
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
