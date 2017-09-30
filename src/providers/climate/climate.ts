import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClimateProvider {
  apiKey = 'YOUR_API_KEY';
  searchUrl: any;

  constructor(public http: Http) {
    this.searchUrl = 'http://api.openweathermap.org/data/2.5/weather?type=accurate&appid=' + this.apiKey;
  }

  getData(city, tempUnit) {
    let units = (tempUnit === 'C') ? 'metric' : 'imperial';
    return this.http.get(this.searchUrl + '&q=' + city + '&units=' + units).map(res => res.json());
  }

  getDataViaCoords(lat, lon, tempUnit) {
    let units = (tempUnit === 'C') ? 'metric' : 'imperial';
    return this.http.get(this.searchUrl + '&lat=' + lat + '&lon=' + lon + '&units=' + units).map(res => res.json());
  }
}
