import { Component, ElementRef, ViewChild, Renderer } from '@angular/core';
import { IonicPage, NavController, NavParams, App, ToastController, Events } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'PersonalInfo'
})
@Component({
  selector: 'page-personal-info',
  templateUrl: 'personal-info.html',
})
export class PersonalInfoPage {

  msgNum = 2;
  isLogin: boolean = false;

  @ViewChild('info') infoBox: ElementRef;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public app: App,
              private renderer: Renderer,
              private global: GlobalDataProvider,
              private toastCtrl: ToastController,
              private http: Http,
              public events: Events) {

    events.subscribe('login', () => { this.isLogin = true; });
    events.subscribe('getNewMsg', (msgLen) => { this.msgNum = msgLen; });
    events.subscribe('readNewMsg', () => { this.msgNum = 0; });
    this.msgNum = global.newMsgNum;

    if (global.userInfo) this.isLogin = true;
  }

  ionViewDidLoad() {
  }

  switchPage(page) {
    if (page === 'C4') return this.app.getRootNav().push('C4');

    if (!this.isLogin)  return this.app.getRootNav().push('Entry');

    if (page === 'A4') return this.app.getRootNav().push('A4');

    if (page === 'C3') return this.app.getRootNav().push('C3');

    if (this.global.userInfo.identity !== 'admin') return this.presentToast('权限不够！');

    this.app.getRootNav().push(page);
  }

  scrollHandler(e) {
    let $contentEl = document.querySelector('#personalCont').querySelector('.scroll-content'),
      $infoEl = this.infoBox.nativeElement;

    this.renderer.setElementStyle($infoEl, 'height', `${(-e.scrollTop+114).toFixed(2)}px`);
    this.renderer.setElementStyle($infoEl, 'transform', `scale(${(1-e.scrollTop/114).toFixed(2)})`);
    $contentEl.setAttribute('style', `margin-top: ${(-e.scrollTop+170).toFixed(2)}px;margin-bottom: 56px;`);

    if (e.scrollTop > 114) {
      this.renderer.setElementStyle($infoEl, 'height', `0px`);
      this.renderer.setElementStyle($infoEl, 'transform', `scale(0)`);
      $contentEl.setAttribute('style', 'margin-top: 56px;margin-bottom: 56px;');
    }
  }

  logout() {
    this.http.get('/api/users/logout').subscribe((response: Response) => {
      let res = response.json();

      if (res.status === 200) {
        this.msgNum = 0;
        this.isLogin = false;
        this.global.logout();
        this.events.publish('logout');
        this.presentToast(res.msg);
      } else {
        this.presentToast('登出失败！');
      }
    });
  }

  presentToast(msg) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 1000,
      position: 'middle',
      cssClass: 'my-toast'
    });

    toast.present();
  }

  ngOnDestroy() {
    this.events.unsubscribe('login');
    this.events.unsubscribe('getNewMsg');
    this.events.unsubscribe('readNewMsg');
  }
}
