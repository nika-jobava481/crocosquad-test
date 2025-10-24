import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TodosService } from '../../core/services/todos/todos.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../core/services/users/users.service';
import { switchMap, forkJoin, map } from 'rxjs';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-user-todos',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './user-todos.component.html',
  styleUrl: './user-todos.component.scss'
})
export class UserTodosComponent implements OnInit {
  private readonly todosService = inject(TodosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);

  todos: any[] = [];
  userId: number = 0;
  user: any = null;
  isLoading: boolean = true;
  error: string | null = null;

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap((params: any) => {
        this.userId = params['userId'];
        this.error = null; // Clear previous errors

        // Check if userId is invalid and redirect
        if (!this.userId || this.userId <= 0) {
          this.router.navigate(['/users']);
          return [];
        }

        return forkJoin({
          todos: this.todosService.getTodos({ userId: this.userId }),
          users: this.usersService.getUsers({ id: this.userId })
        });
      }),
      map(({ todos, users }: any) => ({
        todos,
        user: users[0]
      }))
    ).subscribe({
      next: ({ todos, user }: any) => {
        // Only update if we have valid data (not redirected)
        if (todos && user) {
          this.todos = todos;
          this.user = user;
        }
        this.isLoading = false;
        this.error = null;
      },
      error: (error) => {
        console.error('Error loading todos:', error);
        this.error = this.getErrorMessage(error);
        this.isLoading = false;
        this.todos = [];
        this.user = null;
      }
    });
  }

  private getErrorMessage(error: any): string {
    if (error.status === 404) {
      return 'User not found. Please check the user ID.';
    } else if (error.status === 500) {
      return 'Server error. Please try again later.';
    } else if (error.status === 0) {
      return 'Network error. Please check your internet connection.';
    } else {
      return 'An unexpected error occurred. Please try again.';
    }
  }

  retry(): void {
    this.isLoading = true;
    this.error = null;
    this.ngOnInit();
  }

}
