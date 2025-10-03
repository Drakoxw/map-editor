import { Routes } from '@angular/router';

import { PATH } from '@constants/index';
import { LayoutComponent } from '@shared/components';

import MapEditorComponent from '@poi-editor-module/map-editor/map-editor.component';
import HomeIndexComponent from '@home-module/home-index/home-index.component';
import AboutIndexComponent from '@about-module/about-index/about-index.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: PATH.HOME, component: HomeIndexComponent },
      { path: PATH.EDITOR, component: MapEditorComponent },
      { path: PATH.ABOUT, component: AboutIndexComponent },
      { path: '**', redirectTo: PATH.HOME, pathMatch: 'full' },
      { path: '', redirectTo: PATH.HOME, pathMatch: 'full' },
    ],
  },
];
