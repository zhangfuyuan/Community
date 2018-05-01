import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { IntelPropertyPage } from './intel-property';

@NgModule({
  declarations: [
    IntelPropertyPage,
  ],
  imports: [
    IonicPageModule.forChild(IntelPropertyPage),
  ],
})
export class IntelPropertyPageModule {}
