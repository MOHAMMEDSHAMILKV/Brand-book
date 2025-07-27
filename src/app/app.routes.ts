import { Routes } from '@angular/router';
import { FloatingSceneComponent } from './floating-scene/floating-scene.component';
import { ProjectListComponent } from './projects/project-list/project-list.component';
import { PostListComponent } from './projects/post-list/post-list.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {path:'',component:HomeComponent},
    {path:'animation3d',component:FloatingSceneComponent},
    {path:'project',component:ProjectListComponent},
    {path:'post',component:PostListComponent}
];
