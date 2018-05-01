import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';

import { Http, Response } from '@angular/http';
import { GlobalDataProvider } from '../../providers/global-data/global-data';

@IonicPage({
  name: 'C3'
})
@Component({
  selector: 'page-c3',
  templateUrl: 'c3.html',
})
export class C3Page {

  pet: string = "用户列表";
  allUserItems = [
    {
      "userid" : "a1514736000000",
      "username" : "13888888888",
      "nickname" : "Jeffrey",
      "identity" : "admin",
      "community" : "社区1",
      "remark" : ""
    }, {
      "userid" : "a1523429974837",
      "username" : "13112201239",
      "nickname" : "",
      "identity" : "user",
      "community" : "社区1",
      "remark" : "",
    }, {
      "userid" : "a1523429974000",
      "username" : "18826138431",
      "nickname" : "张先生",
      "identity" : "manager",
      "community" : "社区1",
      "remark" : "社区1的物业管理人员"
    }
  ];
  userItems = [
    {
      "userid" : "a1514736000000",
      "username" : "13888888888",
      "nickname" : "Jeffrey",
      "identity" : "admin",
      "community" : "社区1",
      "remark" : ""
    }, {
      "userid" : "a1523429974837",
      "username" : "13112201239",
      "nickname" : "",
      "identity" : "user",
      "community" : "社区1",
      "remark" : "",
    }, {
      "userid" : "a1523429974000",
      "username" : "18826138431",
      "nickname" : "张先生",
      "identity" : "manager",
      "community" : "社区1",
      "remark" : "社区1的物业管理人员"
    }
  ];
  form = {
    userid: '',
    username: '',
    nickname: '',
    identity: '',
    community: '',
    remark: ''
  };
  searchValue;
  isHideSearchBox = true;
  curUserDetail = null;
  curUserIndex = -1;
  oldIndex = -2;
  communityNameItems = [ "社区1", "社区2", "社区3" ];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private http: Http,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private global: GlobalDataProvider) {

    this.getUserItems();
    this.getCommunityNameItems();
  }

  ionViewDidLoad() {
  }

  getUserItems() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });

    loading.present();

    this.http.get('/api/users/users', { params: {
      username: this.global.userInfo.identity==='admin' ? '' : this.global.userInfo.username
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();

      if (res.status === 200) {
        this.userItems = res.data;
        this.allUserItems = res.data;
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
      this.userItems = this.allUserItems.filter((i) => new RegExp('^'+q, 'i').test(i.username));
    } else {
      this.userItems = this.allUserItems;
    }
    this.curUserDetail = null;
    this.curUserIndex = -1;
  }

  changeCurUser(index, old) {
    if ((!index && index !== 0) ||
      index === -1 ||
      (index === old && this.curUserDetail) ||
      (index === 0 && old === -2 && this.curUserDetail)) return;

    this.curUserDetail = this.userItems[index];
    this.form = JSON.parse(JSON.stringify(this.userItems[index]));
    this.pet = '用户管理';
    this.oldIndex = index;
  }

  postDetail() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    this.http.post('/api/users/edit_user', { detail: {
      userid: this.form.userid,
      username: this.form.username,
      nickname: this.form.nickname,
      identity: this.form.identity,
      community: this.form.community,
      remark: this.form.remark
    } }).subscribe((response: Response) => {
      let res = response.json();

      loading.dismiss();
      this.presentToast(res.msg);

      if (res.status === 200) {
        this.userItems[this.curUserIndex] = res.data;
        this.pet = '用户列表';
        this.curUserDetail = res.data;
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
