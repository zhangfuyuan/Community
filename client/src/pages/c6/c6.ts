import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'C6'
})
@Component({
  selector: 'page-c6',
  templateUrl: 'c6.html',
})
export class C6Page {

  pet: string = "商家列表";
  allMerchantItems = [
    {
      "merchantId" : "h1523440429133",
      "name" : "商家1",
      "community" : "社区1",
      "attribute" : "属性1",
      "authority" : "权限1",
      "remark" : "我是好商家哦，多惠顾哦"
    }, {
      "merchantId" : "h1523440429222",
      "name" : "商家2",
      "community" : "社区1",
      "attribute" : "属性3",
      "authority" : "权限2",
      "remark" : "我是新商家哦，多多关顾哦"
    }
  ];
  merchantItems = [
    {
      "merchantId" : "h1523440429133",
      "name" : "商家1",
      "community" : "社区1",
      "attribute" : "属性1",
      "authority" : "权限1",
      "remark" : "我是好商家哦，多惠顾哦"
    }, {
      "merchantId" : "h1523440429222",
      "name" : "商家2",
      "community" : "社区1",
      "attribute" : "属性3",
      "authority" : "权限2",
      "remark" : "我是新商家哦，多多关顾哦"
    }
  ];
  form = {
    merchantId: '',
    name: '',
    community: '',
    attribute: '',
    authority: '',
    remark: ''
  };
  searchValue;
  isHideSearchBox = true;
  curMerchantDetail = null;
  curMerchantIndex = -1;
  oldIndex = -2;
  communityNameItems = [ "社区1", "社区2", "社区3" ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

    this.getMerchantItems();
    this.getCommunityNameItems();
  }

  ionViewDidLoad() {

  }

  getMerchantItems() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.http.get('/api/merchant').subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.merchantItems = res.data;
        this.allMerchantItems = res.data;
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

  getItems(q: string) {
    q = q.trim();
    if (q) {
      this.merchantItems = this.allMerchantItems.filter((i) => new RegExp(q, 'i').test(i.name));
    } else {
      this.merchantItems = this.allMerchantItems;
    }
    this.curMerchantDetail = null;
    this.curMerchantIndex = -1;
  }

  changeCurMerchant(index, old) {
    if ((!index && index !== 0) ||
      index === -1 ||
      (index === old && this.curMerchantDetail) ||
      (index === 0 && old === -2 && this.curMerchantDetail)) return;

    this.curMerchantDetail = this.merchantItems[index];
    this.form = JSON.parse(JSON.stringify(this.merchantItems[index]));
    this.pet = '商家管理';
    this.oldIndex = index;
  }

  postDetail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.http.post('/api/edit_merchant', { detail: {
      merchantId: this.form.merchantId,
      name: this.form.name,
      community: this.form.community,
      attribute: this.form.attribute,
      authority: this.form.authority,
      remark: this.form.remark
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.merchantItems[this.curMerchantIndex] = res.data;
        this.pet = '商家列表';
        this.curMerchantDetail = res.data;
        this.form = JSON.parse(JSON.stringify(res.data));
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
