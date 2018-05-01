import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'C4'
})
@Component({
  selector: 'page-c4',
  templateUrl: 'c4.html',
})
export class C4Page {

  isLogin = false;
  findPwdTxt = '找回密码';
  timer = null;
  form = {
    editUsername: '',
    editPwd: '',
    editNewPwd: '',
    editConfirmNewPwd: '',
    findUsername: ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              private global: GlobalDataProvider,
              private toastCtrl: ToastController,
              private http: Http,
              public loadingCtrl: LoadingController,
              private storage: Storage) {

    if (global.userInfo) this.isLogin = true;

    this.storage.get('lastFindPwdTimestamp').then((t) => {
      if (t) {
        let s = 60 - Math.floor((Date.now() - parseInt(t))/1000);

        if (s>0 && s<60) this.setFindPwdTxt(s);
      }
    });
  }

  ionViewDidLoad() {
    if (this.global) return;
  }

  findPwd(username) {
    if (!/^1[3458]\d{9}$/.test(username)) return this.presentToast('请输入合法的11位手机号码');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.setFindPwdTxt(60);
    this.storage.set('lastFindPwdTimestamp', Date.now()+'');
    this.http.post('/api/users/find_password', {
      username: username
    }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) this.navCtrl.pop();
    });
  }

  setFindPwdTxt(t: number) {
    if (this.timer) clearInterval(this.timer);

    this.findPwdTxt = t + 's';
    this.timer = setInterval(()=>{
      if (t <= 0) {
        this.findPwdTxt = '找回密码';
        clearInterval(this.timer);
      } else {
        this.findPwdTxt = --t + 's';
      }
    }, 1000);
  }

  editPwd(info) {
    if (info.editNewPwd.length !== 6) return this.presentToast('重置密码必须为6位数字');
    if (info.editNewPwd !== info.editConfirmNewPwd) return this.presentToast('重置密码与确认密码不一致');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.http.post('/api/users/edit_password', {
      username: info.editUsername,
      password: info.editPwd,
      newPassword: info.editNewPwd
    }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) this.navCtrl.pop();
    });
  }

  ngOnDestroy() {
    clearInterval(this.timer);
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'middle',
      cssClass: 'my-toast'
    });

    toast.present();
  }
}
