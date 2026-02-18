import { Component, input } from '@angular/core';

@Component({
  selector: 'app-error-message',
  imports: [],
  template: `<div class="error">
    <p>{{ message() }}</p>
  </div>`,
  styles: [`.error{color: red; padding: 1rem, font-weight: bold;}`],
})
export class ErrorMessage {
  message = input('Something went wrong');
}
