import { Component, HostListener, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PRIVATES_ROUTES, ROUTES } from '@constants/index';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  imports: [RouterLink, RouterLinkActive],
})
export class NavBarComponent {
  #router = inject(Router);
  showMenuMovile = false;
  routes = ROUTES;
  showNav = false;

  #subs: Subscription[] = [];

  constructor() {
    this.#subs.push(
      this.#router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showNav = false;
          PRIVATES_ROUTES.forEach((route) => {
            if (event.urlAfterRedirects.startsWith(route)) {
              this.showNav = true;
            }
          });
          if (this.showMenuMovile) {
            this.showMenuMovile = false;
          }
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.#subs.forEach((sub) => sub.unsubscribe());
  }

  @HostListener('window:resize')
  onResize(): void {
    if (window.innerWidth > 768 && this.showMenuMovile) {
      this.showMenuMovile = false;
    }
  }

  toggleMenu() {
    this.showMenuMovile = !this.showMenuMovile;
  }
}
