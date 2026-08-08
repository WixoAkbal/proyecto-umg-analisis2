import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ButtonModule } from '@openng/optimus-ui/button';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('frontend');
}
