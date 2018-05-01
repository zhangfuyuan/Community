import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'C7'
})
@Component({
  selector: 'page-c7',
  templateUrl: 'c7.html',
})
export class C7Page {

  pet: string = "导入列表";
  addMerchantItems = [];
  form = {
    merchantId: 'h' + Date.now(),
    name: '',
    community: '',
    attribute: '',
    authority: '',
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

    this.http.post('/api/add_merchant', { detail: {
      merchantId: this.form.merchantId,
      name: this.form.name.trim(),
      community: this.form.community,
      attribute: this.form.attribute,
      authority: this.form.authority,
      remark: this.form.remark
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.addMerchantItems.unshift(res.data);
        this.pet = '导入列表';
        this.form = {
          merchantId: 'h' + Date.now(),
          name: '',
          community: '',
          attribute: '',
          authority: '',
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
