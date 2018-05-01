import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Events, ToastController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';
import { Storage } from '@ionic/storage';

@IonicPage({
  name: 'Entry'
})
@Component({
  selector: 'page-entry',
  templateUrl: 'entry.html',
})
export class EntryPage {

  @ViewChild('username', { read: ElementRef }) usernameInput: ElementRef;
  @ViewChild('password', { read: ElementRef }) passwordInput: ElementRef;

  usernameIsCheck = false;
  passwordIsCheck = false;
  form = {
    username: '',
    password: ''
  };
  isSavePwd = false;
  isPop = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public events: Events,
              private global: GlobalDataProvider,
              private toastCtrl: ToastController,
              private storage: Storage) {
  }

  ionViewWillEnter() {
    this.storage.get('username').then((val) => {
      if (val) {
        this.usernameIsCheck = true;
        this.form.username = val;
      }
    });
    this.storage.get('password').then((val) => {
      if (val) {
        this.passwordIsCheck = true;
        this.isSavePwd = true;
        this.form.password = val;
      }
    });
  }

  checkUsername(val) {
    this.usernameIsCheck = /^1[3458]\d{9}$/.test(val);
  }

  checkPassword(val) {
    this.passwordIsCheck = val.length===6;
  }

  passwordFocus(keyCode) {
    if (keyCode === 13 || keyCode === 40) this.passwordInput.nativeElement.querySelector('input').focus();
  }

  loginFocus(keyCode) {
    if (keyCode === 13 && this.usernameIsCheck && this.passwordIsCheck) this.login();
  }

  login() {
    if (this.isPop) return;

    this.http.post('/api/users/login', {
      username: this.form.username,
      password: this.form.password
    }).subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.global.userInfo = res.data;
        this.events.publish('login', res.data);
        this.storage.get('username').then((val) => {
          if (val !== this.form.username) this.storage.set('username', this.form.username);
        });

        if (this.isSavePwd)  {
          this.storage.get('password').then((val) => {
            if (val !== this.form.password) this.storage.set('password', this.form.password);
          });
        }

        this.presentToast(res.msg);
        this.isPop = true;
        this.navCtrl.pop();
      } else {
        this.global.userInfo = null;
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

  ionViewDidLeave() {
    if (!this.isSavePwd) {
      this.storage.get('password').then((val) => {
        if (val) this.storage.set('password', '');
      });
    }
  }
}
