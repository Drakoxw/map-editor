import { Component, OnInit, Renderer2, Inject, signal } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  imports: [RouterOutlet],
})
export class App implements OnInit {
  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) {}

  ngOnInit() {
    this.renderer.removeClass(this.document.documentElement, 'dark');
    this.renderer.addClass(this.document.documentElement, 'light');
  }
}
