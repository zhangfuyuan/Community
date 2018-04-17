import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'C2'
})
@Component({
  selector: 'page-c2',
  templateUrl: 'c2.html',
})
export class C2Page {

  pet: string = "社区列表";
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
