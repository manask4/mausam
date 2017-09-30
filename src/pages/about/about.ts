import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { PageTransitionOptions } from '../../app/app.pageTransitions';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  constructor(public navCtrl: NavController, private nativePageTransitions: NativePageTransitions) {

  }

  ionViewWillLeave() {
    this.nativePageTransitions.slide(PageTransitionOptions);
  }
}
