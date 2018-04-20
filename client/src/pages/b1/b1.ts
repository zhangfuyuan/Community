import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, Events, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

import { InAppBrowser } from '@ionic-native/in-app-browser';

@IonicPage({
  name: 'B1'
})
@Component({
  selector: 'page-b1',
  templateUrl: 'b1.html',
})
export class B1Page {

  pet: string = "工单列表";
  workOrderItems = [
    {
      "workOrderId" : "b1523429974837",
      "kind" : "工程报修",
      "status" : "1",
      "evaluate" : "",
      "proposer" : "13112201239",
      "approver" : "",
      "startDate" : "2018-04-01",
      "startTime" : "08:00",
      "endDate" : "2018-04-01",
      "endTime" : "12:00",
      "remark" : "我要申请的工程保修类的工单，快来人啊！",
      "community" : "社区1"
    }
  ];
  curWorkOrderDetail = null;
  curWorkOrderIndex;
  form = {
    "workOrderId" : "b1523429974837",
    "kind" : "工程报修",
    "status" : "1",
    "evaluate" : "",
    "proposer" : "13112201239",
    "approver" : "",
    "startDate" : "2018-04-01",
    "startTime" : "08:00",
    "endDate" : "2018-04-01",
    "endTime" : "12:00",
    "remark" : "我要申请的工程保修类的工单，快来人啊！",
    "community" : "社区1"
  };
  action = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private popoverCtrl: PopoverController,
              public events: Events,
              private http: Http,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider,
              private iab: InAppBrowser) {

    let isUser = global.userInfo.identity === 'user';

    events.subscribe('b1-filter', (status, kind) => {
      this.getWorkOrderItems(isUser, isUser?global.userInfo.username:global.userInfo.community, status, kind);
    });
    this.getWorkOrderItems(isUser, isUser?global.userInfo.username:global.userInfo.community, '\\S', '\\S');
  }

  ionViewDidLoad() {
  }

  getWorkOrderItems(isUser, key, status, kind) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('/api/workOrder', { params: {
      isUser: isUser,
      key: key,
      status: status,
      kind: kind
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.workOrderItems = res.data;
        this.curWorkOrderDetail = null;
        this.curWorkOrderIndex = -1;
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  changeCurWorkOrder(index) {
    if ((!this.curWorkOrderIndex && this.curWorkOrderIndex!==0) ||
      this.curWorkOrderIndex === -1) return;

    this.curWorkOrderDetail = this.workOrderItems[index];
    this.form = JSON.parse(JSON.stringify(this.workOrderItems[index]));
    this.action = 'edit';
  }

  changeAction(action) {
    switch (action) {
      case 'add':
        this.action = 'add';
        this.form = {
          workOrderId: 'b' + Date.now(),
          kind: "",
          status: "0",
          evaluate: "",
          proposer: this.global.userInfo.username,
          approver: "",
          startDate: "",
          startTime: "",
          endDate: "",
          endTime: "",
          remark: "",
          community: this.global.userInfo.community
        };
        this.curWorkOrderDetail = this.form;
        this.curWorkOrderIndex = -1;
        this.pet = '工单操作';
        break;

      case 'remove':
        if ((!this.curWorkOrderIndex && this.curWorkOrderIndex!==0) ||
          this.curWorkOrderIndex === -1)
          return this.presentToast('暂无已选择的工单可删除！');

        this.action = 'remove';
        let confirm = this.alertCtrl.create({
          title: '警告',
          message: '确定要删除此条工单吗?',
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
        if ((!this.curWorkOrderIndex && this.curWorkOrderIndex!==0) ||
          this.curWorkOrderIndex === -1)
          return this.presentToast('暂无已选择的工单可修改！');

        this.action = 'edit';
        this.pet = '工单操作';
        break;

      case 'print':
        if ((!this.curWorkOrderIndex && this.curWorkOrderIndex!==0) ||
          this.curWorkOrderIndex === -1)
          return this.presentToast('暂无已选择的工单可打印！');

        let url = 'http://localhost:3000/print_workOrder?workOrderId=' + this.curWorkOrderDetail.workOrderId;
        const browser = this.iab.create(url, '_system');

        browser.show();
        break;
    }
  }

  postDetail(post) {
    if (this.form.startDate + this.form.startTime >= this.form.endDate + this.form.endTime)
      return this.presentToast('开始时间需要小于结束时间！');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/' + post + '_workOrder', { detail: {
      workOrderId: this.form.workOrderId,
      kind: this.form.kind || '（无分业务）',
      status: this.form.status === '2' ? '3' : '1',
      evaluate: this.form.evaluate,
      proposer: this.global.userInfo.username,
      approver: this.form.approver,
      startDate: this.form.startDate,
      startTime: this.form.startTime,
      endDate: this.form.endDate,
      endTime: this.form.endTime,
      remark: this.form.remark,
      community: this.global.userInfo.community
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        switch (this.action) {
          case 'add':
            this.workOrderItems.unshift(res.data);
            this.curWorkOrderIndex = 0;
            this.pet = '工单列表';
            this.curWorkOrderDetail = res.data;
            this.form = JSON.parse(JSON.stringify(res.data));
            this.action = 'edit';
            break;

          case 'remove':
            this.workOrderItems.splice(this.curWorkOrderIndex, 1);
            this.curWorkOrderIndex = -1;
            this.curWorkOrderDetail = null;
            break;

          case 'edit':
            this.workOrderItems[this.curWorkOrderIndex] = res.data;
            this.pet = '工单列表';
            this.curWorkOrderDetail = res.data;
            this.form = JSON.parse(JSON.stringify(res.data));
            break;
        }
      }
    });
  }

  approve(reply) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/approve_workOrder', {
      workOrderId: this.curWorkOrderDetail.workOrderId,
      reply: reply,
      replier: this.global.userInfo.username
    }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.workOrderItems[this.curWorkOrderIndex].status = reply;
        this.workOrderItems[this.curWorkOrderIndex].approver = this.global.userInfo.username;
        this.pet = '工单列表';
        this.curWorkOrderDetail.status = reply;
        this.form.status = reply;
        this.curWorkOrderDetail.approver = this.global.userInfo.username;
        this.form.approver = this.global.userInfo.username;
      }
    });
  }

  presentPopover(ev) {
    let popover = this.popoverCtrl.create('B1Popover');

    this.pet = "工单列表";
    popover.present({
      ev: ev
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
    this.events.unsubscribe('b1-filter');
  }
}
