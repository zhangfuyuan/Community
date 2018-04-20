import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'B9'
})
@Component({
  selector: 'page-b9',
  templateUrl: 'b9.html',
})
export class B9Page {

  pet: string = "申请列表";
  applicationItems = [
    {
      applicationId: "d1523435839421",
      kind: "会议室申请",
      proposer: "13112201239",
      approver: "18826138431",
      startDate : "2018-04-01",
      startTime : "08:00",
      endDate : "2018-04-01",
      endTime : "12:00",
      remark: "我要租用会议室开派对",
      community: "社区1",
      status: "2",
      b9: {
        address: "会议室1",
        cost: '0'
      },
      applicationTime: new Date()
    }
  ];
  curApplicationDetail = null;
  curApplicationIndex;
  form = {
    applicationId: "d1523435839421",
    kind: "会议室申请",
    proposer: "13112201239",
    approver: "18826138431",
    startDate : "2018-04-01",
    startTime : "08:00",
    endDate : "2018-04-01",
    endTime : "12:00",
    remark: "我要租用会议室开派对",
    community: "社区1",
    status: "2",
    b9: {
      address: "会议室1",
      cost: '0'
    },
    applicationTime: new Date()
  };
  action;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider) {

    let isUser = global.userInfo.identity === 'user';

    this.getApplicationItems(isUser, isUser?global.userInfo.username:global.userInfo.community, '会议室申请');
  }

  ionViewDidLoad() {
  }

  getApplicationItems(isUser, key, kind) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('/api/application', { params: {
      isUser: isUser,
      key: key,
      kind: kind
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.applicationItems = res.data;
        this.curApplicationDetail = null;
        this.curApplicationIndex = -1;
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  changeCurApplication(index) {
    if ((!this.curApplicationIndex && this.curApplicationIndex!==0) ||
      this.curApplicationIndex === -1) return;

    this.curApplicationDetail = this.applicationItems[index];
    this.form = JSON.parse(JSON.stringify(this.applicationItems[index]));
    this.action = 'edit';
  }

  changeAction(action) {
    switch (action) {
      case 'add':
        let nowDate = Date.now();

        this.action = 'add';
        this.form = {
          applicationId: 'd' + nowDate,
          kind: '会议室申请',
          proposer: this.global.userInfo.username,
          approver: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          remark: '',
          community: '',
          status: '0',
          b9: {
            address: '',
            cost: '0'
          },
          applicationTime: new Date()
        };
        this.curApplicationDetail = this.form;
        this.curApplicationIndex = -1;
        this.pet = '申请操作';
        break;

      case 'remove':
        if ((!this.curApplicationIndex && this.curApplicationIndex!==0) ||
          this.curApplicationIndex === -1)
          return this.presentToast('暂无已选择的申请可删除！');

        this.action = 'remove';
        let confirm = this.alertCtrl.create({
          title: '警告',
          message: '确定要删除此条申请吗?',
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
        if ((!this.curApplicationIndex && this.curApplicationIndex!==0) ||
          this.curApplicationIndex === -1)
          return this.presentToast('暂无已选择的申请可修改！');

        this.action = 'edit';
        this.pet = '申请操作';
        break;
    }
  }

  getCost() {
    console.log(66)

    if (this.form.startDate + this.form.startTime >= this.form.endDate + this.form.endTime || !this.form.b9.address) return '0';

    let addressCost, hourCost, timestamp;

    addressCost = parseInt(this.form.b9.address.substr(-1, 1))*100;
    timestamp = new Date(this.form.endDate+' '+this.form.endTime).getTime() - new Date(this.form.startDate+' '+this.form.startTime).getTime();
    hourCost = Math.floor(timestamp/(1000*60*30))*25;
    this.form.b9.cost =  addressCost + hourCost + '';
  }

  postDetail(post) {
    if (this.form.startDate + this.form.startTime >= this.form.endDate + this.form.endTime)
      return this.presentToast('开始时间需要小于结束时间！');

    if (!this.form.b9.address)
      return this.presentToast('请输入会议室地址！');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/' + post + '_application', { detail: {
      applicationId: this.form.applicationId,
      kind: '会议室申请',
      proposer: this.global.userInfo.username,
      approver: this.form.approver,
      startDate: this.form.startDate,
      startTime: this.form.startTime,
      endDate: this.form.endDate,
      endTime: this.form.endTime,
      remark: this.form.remark,
      community: this.global.userInfo.community,
      status: '1',
      b9: {
        address: this.form.b9.address,
        cost: this.form.b9.cost
      },
      applicationTime: new Date()
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        switch (this.action) {
          case 'add':
            this.applicationItems.unshift(res.data);
            this.curApplicationIndex = 0;
            this.pet = '申请列表';
            this.curApplicationDetail = res.data;
            this.form = JSON.parse(JSON.stringify(res.data));
            this.action = 'edit';
            break;

          case 'remove':
            this.applicationItems.splice(this.curApplicationIndex, 1);
            this.curApplicationIndex = -1;
            this.curApplicationDetail = null;
            break;

          case 'edit':
            this.applicationItems[this.curApplicationIndex] = res.data;
            this.pet = '申请列表';
            this.curApplicationDetail = res.data;
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

    this.http.post('/api/approve_application', {
      applicationId: this.curApplicationDetail.applicationId,
      reply: reply,
      replier: this.global.userInfo.username
    }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.applicationItems[this.curApplicationIndex].status = reply;
        this.applicationItems[this.curApplicationIndex].approver = this.global.userInfo.username;
        this.pet = '申请列表';
        this.curApplicationDetail.status = reply;
        this.form.status = reply;
        this.curApplicationDetail.approver = this.global.userInfo.username;
        this.form.approver = this.global.userInfo.username;
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
