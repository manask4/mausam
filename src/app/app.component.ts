import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SettingsThemeService } from '../pages/settings/settings.theme';
import { Storage } from '@ionic/storage';



import { TabsPage } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;
  selectedTheme: String;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,
    private themeSettings: SettingsThemeService, private storage: Storage) {
    platform.ready().then(() => {
      this.storage.get('settings').then((val) => {
        if (val !== null) {
          let settings = JSON.parse(val);
          this.themeSettings.setTheme(settings.theme + '-theme');
        }
      });
      this.themeSettings.getTheme().subscribe(val => this.selectedTheme = val);
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
