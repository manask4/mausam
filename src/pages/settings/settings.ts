import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SettingsThemeService } from './settings.theme';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { PageTransitionOptions } from '../../app/app.pageTransitions';


@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})

export class SettingsPage {
  tempUnit: any;
  theme: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private storage: Storage,
    private themeSettings: SettingsThemeService, private nativePageTransitions: NativePageTransitions) {
  }

  ionViewDidLoad() {
    this.storage.get('settings').then((val) => {
      if (val !== null) {
        let settings = JSON.parse(val);
        this.tempUnit = settings.tempUnit;
        this.theme = settings.theme;
      }
      else {
        this.tempUnit = 'C';
        this.theme = 'light';
      }
    });
  }

  radioChecked() {
    let settings = {
      tempUnit: this.tempUnit,
      theme: this.theme
    }
    this.storage.set('settings', JSON.stringify(settings));

    // change theme here
    this.themeSettings.setTheme(this.theme + '-theme');    
  }

  ionViewWillLeave() {
    this.nativePageTransitions.slide(PageTransitionOptions);
  }
}
