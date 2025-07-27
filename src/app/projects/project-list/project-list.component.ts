import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Project, ProjectService } from '../../services/project.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { JsonPlaceholderService, Post } from '../../services/json-placeholder.service';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './project-list.component.html',
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent {
  form!: FormGroup;
  projects: Project[] = [];
  editingId: number | null = null;
  data: Post[] =[];
  

  constructor(private fb: FormBuilder, private projectService: ProjectService, private jsonService:JsonPlaceholderService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [''],
      description: ['']
    });

    this.projectService.projects$.subscribe(data => this.projects = data);
  }

  save() {
    if (this.editingId) {
      this.projectService.update({ ...this.form.value, id: this.editingId });
    } else {
      this.projectService.create(this.form.value);
    }
    this.reset();
  }

  edit(project: Project) {
    this.form.patchValue(project);
    this.editingId = project.id;
  }

  delete(id: number) {
    this.projectService.delete(id);
  }

  reset() {
    this.form.reset();
    this.editingId = null;
  }


}
