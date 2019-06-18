import { Component } from '@angular/core';
import { LoopBackConfig } from 'src/app/shared/sdk/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {

  constructor() {
    LoopBackConfig.setBaseURL('http://pow101825:3000');
    LoopBackConfig.setApiVersion('api');
  }

}
