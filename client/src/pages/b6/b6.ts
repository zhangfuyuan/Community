import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { WebSocketProvider } from '../../providers/web-socket/web-socket';
import { Storage } from '@ionic/storage';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'B6'
})
@Component({
  selector: 'page-b6',
  templateUrl: 'b6.html',
})
export class B6Page {

  @ViewChild('lyScroll') lyScrollDiv: ElementRef;
  inputTxt: string;
  msgItems = [];
  isServicer = false;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private wsService: WebSocketProvider,
              private storage: Storage,
              private global: GlobalDataProvider) {

    storage.get('serviceMsgItems').then((val) => {
      if (val) {
        this.msgItems = JSON.parse(val);
      }
    });

    if (global.userInfo.identity === 'admin') this.isServicer = true;
  }

  ionViewDidLoad() {
    if (!this.global.userInfo) return;

    if (!this.isServicer) {
      this.msgItems.push({
        sender: '客服',
        time: new Date()['format']('yyyy-MM-dd hh:mm:ss'),
        content: '这里是在线客服，很高兴为您服务！'
      });
      this.storage.set('serviceMsgItems', JSON.stringify(this.msgItems));
    }

    this.wsService.createObservableSocket('ws://localhost:3000/ws').subscribe(
      data => {
        let msgItems = JSON.parse(data),
          oldTimeItems = this.msgItems.map(item => item.time);

        msgItems.map((item) => {
          if (oldTimeItems.indexOf(item.time) === -1) {
            this.msgItems.push({
              sender: ((this.isServicer&&item.sender==='客服') || (!this.isServicer&&item.sender!=='客服')) ? '我' : item.sender,
              time: item.time,
              content: item.content
            });
          }
        });
        this.storage.set('serviceMsgItems', JSON.stringify(this.msgItems));

        let scrollDiv = this.lyScrollDiv.nativeElement,
          scrollDivHeight = scrollDiv.getBoundingClientRect().height,
          scrollDivBottom = scrollDiv.getBoundingClientRect().bottom;

        if (scrollDivHeight > 650 && scrollDivBottom >650)
          scrollDiv.setAttribute('style', `position: relative; top: -${(scrollDivBottom-300).toFixed(2)}px`);
      },
      err => console.log(err),
      () => console.log('WebSocket 已结束！')
    );
  }

  sendMessageToServer(txt: string){
    if (!txt || !txt.trim()) return;

    this.wsService.sendMessage(JSON.stringify({
      sender: this.isServicer ? '客服' : '用户',
      time: new Date()['format']('yyyy-MM-dd hh:mm:ss'),
      content: txt
    }));
    this.inputTxt = '';
  }

  scrollHandler(e) {
    let scrollDiv = this.lyScrollDiv.nativeElement;

    if (e.scrollTop < 650) scrollDiv.setAttribute('style', ``);
  }
}
