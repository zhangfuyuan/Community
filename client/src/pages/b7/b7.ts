import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'B7'
})
@Component({
  selector: 'page-b7',
  templateUrl: 'b7.html',
})
export class B7Page {

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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {

  }

}
