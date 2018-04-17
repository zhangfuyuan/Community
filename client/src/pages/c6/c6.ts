import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'C6'
})
@Component({
  selector: 'page-c6',
  templateUrl: 'c6.html',
})
export class C6Page {

  pet: string = "商家列表";
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
