import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Events } from 'ionic-angular';

@IonicPage({
  name: 'B1Popover'
})
@Component({
  selector: 'page-b1-popover',
  templateUrl: 'b1-popover.html',
})
export class B1PopoverPage {

  kind;
  status;

  constructor(public navCtrl: NavController, public navParams: NavParams, public events: Events) {
  }

  ionViewDidLoad() {
  }

  changeKind(kind) {
    if (!kind) return;

    this.events.publish('b1-filter', this.status, this.kind);
  }

  changeStatus(status) {
    if (status === this.status) return;

    this.status = status;
    this.events.publish('b1-filter', this.status, this.kind);
  }
}
