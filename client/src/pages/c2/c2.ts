import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';

@IonicPage({
  name: 'C2'
})
@Component({
  selector: 'page-c2',
  templateUrl: 'c2.html',
})
export class C2Page {

  pet: string = "社区列表";
  allCommunityItems = [
    {
      "communityId" : "g1523439959464",
      "name" : "社区1",
      "attribute" : "属性1",
      "authority" : "权限1",
      "remark" : "这是第一个社区"
    }, {
      "communityId" : "g1523439959000",
      "name" : "社区2",
      "attribute" : "属性2",
      "authority" : "权限2",
      "remark" : "这是第二个社区"
    }, {
      "communityId" : "g1523440429133",
      "name" : "社区3",
      "attribute" : "属性3",
      "authority" : "权限3",
      "remark" : "这是第三个社区"
    }
  ];
  communityItems = [
    {
      "communityId" : "g1523439959464",
      "name" : "社区1",
      "attribute" : "属性1",
      "authority" : "权限1",
      "remark" : "这是第一个社区"
    }, {
      "communityId" : "g1523439959000",
      "name" : "社区2",
      "attribute" : "属性2",
      "authority" : "权限2",
      "remark" : "这是第二个社区"
    }, {
      "communityId" : "g1523440429133",
      "name" : "社区3",
      "attribute" : "属性3",
      "authority" : "权限3",
      "remark" : "这是第三个社区"
    }
  ];
  form = {
    communityId: 'g1523439959464',
    name: '社区1',
    attribute: '属性1',
    authority: '权限1',
    remark: '这是第一个社区'
  };
  searchValue;
  isHideSearchBox = true;
  curCommunityDetail = null;
  curCommunityIndex = -1;
  oldIndex = -2;
  action;
  searchVal: string = '';

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController) {

    this.getCommunityItems();
  }

  ionViewDidLoad() {
  }

  getCommunityItems() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('/api/community').subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.communityItems = res.data;
        this.allCommunityItems = res.data;
      } else {
        this.presentToast(res.msg);
      }
    });
  }

  getItems(q: string) {
    q = q.trim();
    if (q) {
      this.communityItems = this.allCommunityItems.filter((i) => new RegExp(q, 'i').test(i.name));
    } else {
      this.communityItems = this.allCommunityItems;
    }
    this.curCommunityDetail = null;
    this.curCommunityIndex = -1;
    this.searchVal = q;
  }

  changeAction(action) {
    switch (action) {
      case 'add':
        this.action = 'add';
        this.form = {
          communityId: 'g' + Date.now(),
          name: '',
          attribute: '',
          authority: '',
          remark: ''
        };
        this.curCommunityDetail = this.form;
        this.curCommunityIndex = -1;
        this.oldIndex = -2;
        this.pet = '社区管理';
        break;

      case 'edit':
        if ((!this.curCommunityIndex && this.curCommunityIndex!==0) ||
          this.curCommunityIndex === -1)
          return this.presentToast('暂无已选择的社区可修改！');

        this.action = 'edit';
        this.pet = '社区管理';
        break;
    }
  }

  changeCurCommunity(index, old) {
    if ((!index && index !== 0) ||
      index === -1 ||
      (index === old && this.curCommunityDetail) ||
      (index === 0 && old === -2 && this.curCommunityDetail)) return;

    this.curCommunityDetail = this.communityItems[index];
    this.form = JSON.parse(JSON.stringify(this.communityItems[index]));
    this.changeAction('edit');
    this.oldIndex = index;
  }

  postDetail(post) {
    if (!this.form.name)
      return this.presentToast('社区名称不能为空！');

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.post('/api/' + post + '_community', { detail: {
      communityId: this.form.communityId,
      name: this.form.name,
      attribute: this.form.attribute,
      authority: this.form.authority,
      remark: this.form.remark
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        switch (this.action) {
          case 'add':
            if (new RegExp(this.searchVal, 'i').test(res.data.name)) this.communityItems.unshift(res.data);
            this.allCommunityItems.unshift(res.data);
            this.curCommunityIndex = 0;
            this.pet = '社区列表';
            this.curCommunityDetail = res.data;
            this.form = JSON.parse(JSON.stringify(res.data));
            this.action = 'edit';
            break;

          case 'edit':
            this.communityItems[this.curCommunityIndex] = res.data;
            this.pet = '社区列表';
            this.curCommunityDetail = res.data;
            this.form = JSON.parse(JSON.stringify(res.data));
            break;
        }
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
