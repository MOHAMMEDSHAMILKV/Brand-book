import { Component } from '@angular/core';
import { ProjectListComponent } from '../projects/project-list/project-list.component';
import { PostListComponent } from '../projects/post-list/post-list.component';
import { FloatingSceneComponent } from '../floating-scene/floating-scene.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ProjectListComponent, PostListComponent, FloatingSceneComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
activeComponent: 'project' | 'post' | 'floating' = 'project';
}
