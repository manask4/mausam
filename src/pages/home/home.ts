import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ClimateProvider } from '../../providers/climate/climate';
import { LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { ToastController } from 'ionic-angular';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { PageTransitionOptions } from '../../app/app.pageTransitions';


@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  cities: Array<string>;
  shuffledCities: Array<string>;
  city: any;
  weather: any;
  settings: {
    tempUnit: any;
    theme: any;
  };
  hasError: boolean = false;

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController,
    private climateProvider: ClimateProvider, private storage: Storage, private geo: Geolocation,
    public toastCtrl: ToastController, private nativePageTransitions: NativePageTransitions) {
    this.cities = ['Mumbai', 'New York', 'Tokyo', 'Dubai', 'Paris', 'Berlin', 'London', 'Singapore'];
  }

  ionViewWillEnter() {
    this.storage.get('settings').then((val) => {
      if (val != null) {
        this.settings = JSON.parse(val);
      }
      else {
        this.settings = {
          tempUnit: 'C',
          theme: 'light',
        }
      }
    });

    this.storage.get('city').then((city) => {
      if (city != null) {
        this.city = city;
        let units = this.settings.tempUnit;
        this.climateProvider.getData(city, units).subscribe(weather => {
          this.weather = weather;
          this.formatVisibility(weather.visibility);
          this.formatSunRiseSet(weather.sys);
        });
      }
    });
  }

  getWeather() {
    if (isNaN(this.city)) {
      let loading = this.loadingCtrl.create({
        content: 'Searching...'
      });
      loading.present();

      let city = this.city;
      let units = this.settings.tempUnit;

      this.storage.set('city', city);

      this.climateProvider.getData(city, units).subscribe(
        weather => {
          this.weather = weather;
          this.formatVisibility(weather.visibility);
          this.formatSunRiseSet(weather.sys);
          this.hasError = false;
          loading.dismiss();
        },
        error => {
          if (error.status === 404) {
            this.hasError = true;
            loading.dismiss();
            this.city = null;
            this.storage.set('city', this.city);
            this.shuffleCities();
          }
        }
      );
    }
    else {
      this.city = null;
      this.storage.set('city', this.city);
      this.hasError = true;
      this.shuffleCities();
    }
  }

  shuffleCities() {
    const citiesShuffled = this.cities.sort(() => .5 - Math.random());
    this.shuffledCities = citiesShuffled.slice(0, 4);
  }

  formatVisibility(visibility) {
    if (visibility == null || visibility == undefined) {
      this.weather.visibility = 'NA';
    }
    else {
      this.weather.visibility = (visibility / 1000).toFixed(2) + ' km';
    }
  }

  formatSunRiseSet(time) {
    this.weather.sys.sunrise = new Date(time.sunrise * 1000).toLocaleTimeString('en-US');
    this.weather.sys.sunset = new Date(time.sunset * 1000).toLocaleTimeString('en-US');
  }

  locateMe() {
    this.geo.getCurrentPosition().then((resp) => {
      let lat = resp.coords.latitude;
      let lon = resp.coords.longitude;
      let loading = this.loadingCtrl.create({
        content: 'Searching...'
      });
      loading.present();

      let units = this.settings.tempUnit;
      this.climateProvider.getDataViaCoords(lat, lon, units).subscribe(weather => {
        this.weather = weather;
        this.city = weather.name;
        this.formatVisibility(weather.visibility);
        this.formatSunRiseSet(weather.sys);
        this.storage.set('city', this.city);
        loading.dismiss();
      });
    }).catch((error) => {
      let errorMsg = 'Something went wrong :(';
      if (error.code === 1) {
        errorMsg = 'Please allow location access to display weather.';
      }
      let toast = this.toastCtrl.create({
        message: errorMsg,
        duration: 2000,
        cssClass: "toast-msg",
      });
      toast.present();
    });
  }

  doRefresh(refresher) {
    let city = this.city;
    let units = this.settings.tempUnit;
    this.climateProvider.getData(city, units).subscribe(
      weather => {
        this.weather = weather;
        this.formatVisibility(weather.visibility);
        this.formatSunRiseSet(weather.sys);
        this.hasError = false;
        refresher.complete();
      },
    );
  }

  suggestedWeather(event) {
    this.city = event.target.innerHTML;
    this.climateProvider.getData(this.city, this.settings.tempUnit).subscribe(
      weather => {
        this.weather = weather;
        this.formatVisibility(weather.visibility);
        this.formatSunRiseSet(weather.sys);
        this.hasError = false;
      }
    );
  }

  ionViewWillLeave() {
    this.nativePageTransitions.slide(PageTransitionOptions);
  }


}
