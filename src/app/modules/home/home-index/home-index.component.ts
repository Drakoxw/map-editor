import { Component } from '@angular/core';
import { InformationComponent } from '@home-module/components';

@Component({
  selector: 'app-home-index',
  templateUrl: './home-index.component.html',
  styleUrls: ['./home-index.component.css'],
  imports: [InformationComponent]
})
export default class HomeIndexComponent {}
