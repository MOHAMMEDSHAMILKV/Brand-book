import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Project {
  id: number;
  name: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private data: Project[] = [
    { id: 1, name: 'Demo Project', description: 'Test project 1' }
  ];
  private data$ = new BehaviorSubject<Project[]>(this.data);
  projects$ = this.data$.asObservable();

  create(project: Project) {
    project.id = Date.now();
    this.data.push(project);
    this.data$.next(this.data);
  }

  update(project: Project) {
    this.data = this.data.map(p => (p.id === project.id ? project : p));
    this.data$.next(this.data);
  }

  delete(id: number) {
    this.data = this.data.filter(p => p.id !== id);
    this.data$.next(this.data);
  }
}
