import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Camera, CameraOptions } from '@ionic-native/camera';

@IonicPage({
  name: 'B2'
})
@Component({
  selector: 'page-b2',
  templateUrl: 'b2.html',
})
export class B2Page {

  pet: string = "申请列表";
  applicationItems = [
    {
      applicationId: "d1523435839421",
      kind: "入驻申请",
      proposer: "13112201239",
      approver: "18826138431",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: "",
      remark: "我要入驻社区1",
      community: "",
      status: "2",
      b2: {
        enterCommunity: "社区1",
        materialImg: ""
      },
      applicationTime: new Date()
    }
  ];
  materialImgUri;
  curApplicationDetail = null;
  curApplicationIndex;
  form = {
    applicationId: "d1523435839421",
    kind: "入驻申请",
    proposer: "13112201239",
    approver: "18826138431",
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    remark: "我要入驻社区1",
    community: "",
    status: "2",
    b2: {
      enterCommunity: "社区1",
      materialImg: ""
    },
    applicationTime: new Date()
  };
  action;
  communityNameItems = [ "社区1", "社区2", "社区3" ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider,
              private iab: InAppBrowser,
              private camera: Camera) {

    let isUser = global.userInfo.identity === 'user';

    this.getApplicationItems(isUser, isUser?global.userInfo.username:global.userInfo.community, '入驻申请');
    this.getCommunityNameItems();
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

  changeCurApplication(index) {
    if ((!this.curApplicationIndex && this.curApplicationIndex!==0) ||
      this.curApplicationIndex === -1) return;

    this.curApplicationDetail = this.applicationItems[index];
    this.form = JSON.parse(JSON.stringify(this.applicationItems[index]));
    this.materialImgUri = this.applicationItems[index].b2.materialImg;
    this.action = 'edit';
  }

  changeAction(action) {
    switch (action) {
      case 'add':
        let nowDate = Date.now();

        this.action = 'add';
        this.form = {
          applicationId: 'd' + nowDate,
          kind: '入驻申请',
          proposer: this.global.userInfo.username,
          approver: '',
          startDate: '',
          startTime: '',
          endDate: '',
          endTime: '',
          remark: '',
          community: this.global.userInfo.community,
          status: '0',
          b2: {
            enterCommunity: '',
            materialImg: ''
          },
          applicationTime: new Date()
        };
        this.curApplicationDetail = this.form;
        this.curApplicationIndex = -1;
        this.materialImgUri = '';
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
        this.materialImgUri = this.curApplicationDetail.b2.materialImg;
        this.pet = '申请操作';
        break;
    }
  }

  postDetail(post) {
    if (!this.form.b2.enterCommunity)
      return this.presentToast('请选择入驻社区！');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/' + post + '_application', { detail: {
      applicationId: this.form.applicationId,
      kind: '入驻申请',
      proposer: this.global.userInfo.username,
      approver: this.form.approver,
      startDate: '',
      startTime: '',
      endDate: '',
      endTime: '',
      remark: this.form.remark,
      community: this.form.community,
      status: '1',
      b2: {
        enterCommunity: this.form.b2.enterCommunity,
        materialImg: this.materialImgUri ? 'http://localhost:3000/public/images/' + this.form.applicationId + '.jpg' : ''
      },
      applicationTime: new Date()
    },
      base64Image: this.materialImgUri===this.form.b2.materialImg ? '' : this.materialImgUri
    }).subscribe((response: Response) => {
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
            this.materialImgUri = '';
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
      replier: this.global.userInfo.username,
      kind: this.curApplicationDetail.kind,
      proposer: this.curApplicationDetail.proposer,
      enterCommunity: this.curApplicationDetail.b2.enterCommunity
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

  openImg(url) {
    if (!url) return;

    const browser = this.iab.create(url, '_system');

    browser.show();
  }

  openCamera() {
    let loader = this.loadingCtrl.create({
      content: "Please wait..."
    });

    loader.present();

    const options: CameraOptions = {
      quality: 20,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      saveToPhotoAlbum: true
    };

    this.camera.getPicture(options).then((imageData) => {
      this.materialImgUri = 'data:image/jpeg;base64,' + imageData;
      loader.dismiss();
    }, (err) => {
      loader.dismiss();
      this.presentToast(err);
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
