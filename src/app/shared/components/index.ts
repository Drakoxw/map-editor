import { LayoutComponent } from "./layout/layout.component";
import { MapCustomComponent } from "./map-custom/map-custom.component";
import { NavBarComponent } from "./nav-bar/nav-bar.component";

export const COMPONENT_LIST = [
  MapCustomComponent,
  NavBarComponent,
  LayoutComponent
]

export * from './map-custom/map-custom.component'
export * from './nav-bar/nav-bar.component'
export * from './layout/layout.component'
