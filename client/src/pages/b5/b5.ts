import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

/**
 * Generated class for the B5Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage({
  name: 'B5'
})
@Component({
  selector: 'page-b5',
  templateUrl: 'b5.html',
})
export class B5Page {

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
