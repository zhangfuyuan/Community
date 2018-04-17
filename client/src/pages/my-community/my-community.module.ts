import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyCommunityPage } from './my-community';

@NgModule({
  declarations: [
    MyCommunityPage,
  ],
  imports: [
    IonicPageModule.forChild(MyCommunityPage),
  ],
})
export class MyCommunityPageModule {}
