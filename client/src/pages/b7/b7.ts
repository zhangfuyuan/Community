import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';


import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';


@IonicPage({
  name: 'B7'
})
@Component({
  selector: 'page-b7',
  templateUrl: 'b7.html',
})
export class B7Page {

  adviseItems = [
    {
      "adviseId" : "e1523437833528",
      "kind" : "客服",
      "proposer" : "13112201239",
      "contact" : "13112201239",
      "content" : "！！！！！！！！！！",
      "community" : "社区1"
    }, {
      "adviseId" : "e1523438892576",
      "kind" : "其他",
      "proposer" : "13112201239",
      "contact" : "13112201239",
      "content" : "！！！！！！！！！！！！",
      "community" : "社区1"
    }
  ];
  form = {
    "adviseId" : 'e' + Date.now(),
    "kind" : '',
    "proposer" : '',
    "contact" : '',
    "content" : '',
    "community" : ''
  };

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider) {

    if (global.userInfo && global.userInfo.identity !== 'user') {
      this.getAdviseItems(global.userInfo.community);
    } else {
      this.form = {
        "adviseId" : 'e' + Date.now(),
        "kind" : '',
        "proposer" : this.global.userInfo.username,
        "contact" : '',
        "content" : '',
        "community" : this.global.userInfo.community
      }
    }
  }

  ionViewDidLoad() {
  }

  getAdviseItems(community) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('/api/advise', { params: {
      community: community
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.adviseItems = res.data;
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  postDetail() {
    if (!this.form.content)
      return this.presentToast('请输入投诉内容或建议！');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/add_advise', { detail: {
      "adviseId" : this.form.adviseId,
      "kind" : this.form.kind,
      "proposer" : this.global.userInfo.username,
      "contact" : this.form.contact,
      "content" : this.form.content,
      "community" : this.global.userInfo.community
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.navCtrl.pop();
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
