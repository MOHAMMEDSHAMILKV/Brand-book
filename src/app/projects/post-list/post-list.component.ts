import { Component } from '@angular/core';
import { JsonPlaceholderService, Post } from '../../services/json-placeholder.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-post-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './post-list.component.html',
  styleUrl: './post-list.component.scss'
})
export class PostListComponent {
  posts: Post[] = [];
  form!: FormGroup;
  isEditing = false;
  editingPostId: number | null = null;
  loading:boolean = false;

  constructor(
    private service: JsonPlaceholderService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      title: [''],
      body: ['']
    });

    this.loadPosts();
  }

  loadPosts() {
    this.loading = true;
    this.service.getPosts().subscribe(posts => {
      console.log(posts,"posts");
      
      this.posts = posts.slice(0, 5); // limit for readability
      this.loading = false;
    });
  }

submit() {
  this.loading = true;
  if (this.isEditing && this.editingPostId !== null) {
    const updatedPost = { ...this.form.value, id: this.editingPostId };
    console.log(updatedPost,"updated post");
    
    this.service.updatePost(updatedPost).subscribe(() => {
      // Update the local array manually
      const index = this.posts.findIndex(p => p.id === this.editingPostId);
      if (index !== -1) {
        this.posts[index] = updatedPost;
      }
      this.loading = false;
      this.reset();
    });
  } else {
    this.service.createPost(this.form.value).subscribe((newPost) => {
      // Add to the local array manually
      this.posts.unshift({
        ...this.form.value,
        id: Math.floor(Math.random() * 1000) + 101, // Since API won't return real id
      });
      this.reset();
    });
  }
}

  edit(post: Post) {
    this.form.patchValue(post);
    this.isEditing = true;
    this.editingPostId = post.id!;
  }

delete(id: number) {
  this.service.deletePost(id).subscribe(() => {
    // Remove the post from the local array without re-fetching
    this.posts = this.posts.filter(post => post.id !== id);
  });
}

  reset() {
    this.form.reset();
    this.isEditing = false;
    this.editingPostId = null;
  }
}
