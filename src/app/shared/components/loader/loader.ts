import { Component, input } from '@angular/core';

@Component({
  selector: 'app-loader',
  imports: [],
  template: `<div class="loader">
    <p>{{ message() }}</p>
  </div>`,
  styles: [
    `
      .loader {
        padding: 1rem;
        font-weight: bold;
      }
    `,
  ],
})
export class Loader {
  message = input('Loading...');
}
