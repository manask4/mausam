import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/Rx';

@Injectable()
export class SettingsThemeService {
    private theme: BehaviorSubject<String>;
    
    constructor() {
        this.theme = new BehaviorSubject('light-theme');
    }

    setTheme(val) {
        this.theme.next(val);
    }
    
    getTheme() {
        return this.theme.asObservable();
    }
}