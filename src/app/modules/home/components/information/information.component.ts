import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';

import {
  FUNCIONALITIES_ADVANCED,
  FUNCIONALITIES_CORE,
  FUNCTIONALITIES_TECHNICAL,
  FUNCIONALITIES_UX,
} from '@constants/index';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
  imports: [NgTemplateOutlet],
})
export class InformationComponent {
  public functionalities = [
    FUNCIONALITIES_ADVANCED,
    FUNCIONALITIES_CORE,
    FUNCTIONALITIES_TECHNICAL,
    FUNCIONALITIES_UX,
  ];
}
