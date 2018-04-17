import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage({
  name: 'B9'
})
@Component({
  selector: 'page-b9',
  templateUrl: 'b9.html',
})
export class B9Page {

  pet: string = "申请列表";
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
    setTimeout(()=>{
      this.form = {
        code: 'aaaaaaaaaaaaaaaaaaaaaaaa',
        proposer: '张三',
        kind: '加班空调',
        startDate: '2018-01-01',
        startTime: '00:00',
        endDate: '2018-01-02',
        endTime: '00:00',
        reason: '水水水水',
        isCanEvaluate: true,
        evaluate: '',
        isApplied: true
      };
    }, 2000);
  }

  ionViewDidLoad() {

  }

}
