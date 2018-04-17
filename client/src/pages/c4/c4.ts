import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public app: App) {
    setTimeout(()=>{
      this.isLogin = true;
    }, 2000);
  }

  ionViewDidLoad() {

  }

  findPwd() {
    let t = 60;
    this.findPwdTxt = '60s';

    if (this.timer) clearInterval(this.timer);

    this.timer = setInterval(()=>{
      if (t <= 0) {
        this.findPwdTxt = '找回密码';
        clearInterval(this.timer);
      } else {
        this.findPwdTxt = --t + 's';
      }
      console.log(6)
    }, 1000);

  }

  ngOnDestroy(){
    clearInterval(this.timer);
  }

}
