import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FloatingSceneComponent } from './floating-scene/floating-scene.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FloatingSceneComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'threejs';
}
