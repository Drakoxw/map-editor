import { Component } from '@angular/core';

@Component({
  selector: 'app-banner-instructions',
  template: `
    <div class="instructions">
      <strong>Instrucciones:</strong> Haz Click para agregar un punto. El Click en un punto te permite Editarlo o Eliminarlo.
    </div>
  `,
  styles: `
  .instructions {
    padding: 0.75rem 1rem;
    background: #f9f9f9;
    border-top: 1px solid #e0e0e0;
    font-size: 0.875rem;
    color: #666;
    text-align: center;
  }
`,
})
export class BannerInstructionsComponent {}
