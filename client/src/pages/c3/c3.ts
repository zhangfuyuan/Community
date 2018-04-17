import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'C3'
})
@Component({
  selector: 'page-c3',
  templateUrl: 'c3.html',
})
export class C3Page {

  pet: string = "用户列表";
  form = {
    code: 'aaaaaaaaaaaaaaaaaaaaaaaa',
    proposer: '',
    kind: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    reason: '',
    isCanEvaluate: false,
    evaluate: '',
    isApplied: false
  };
  searchValue;
  items= [];
  isHideSearchBox = true;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

  getItems(q: string) {
    if (!q || q.trim() === '') return;

    console.log(q)

    // this.items = this.items.filter((v) => v.toLowerCase().indexOf(q.toLowerCase()) > -1);
  }
}
