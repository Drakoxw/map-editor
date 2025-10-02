import { Component } from '@angular/core';
import { NavBarComponent } from '../nav-bar/nav-bar.component';
import { RouterOutlet } from '@angular/router';

@Component({
    selector: 'app-layout',
    imports: [NavBarComponent, RouterOutlet],
    templateUrl: './layout.component.html',
    styleUrl: './layout.component.css'
})
export class LayoutComponent {

}
