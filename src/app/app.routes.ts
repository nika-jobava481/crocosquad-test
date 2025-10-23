import { Routes } from '@angular/router';
import { UsersComponent } from './pages/users/users.component';
import { PostsComponent } from './pages/posts/posts.component';
import { PromotionsComponent } from './pages/promotions/promotions.component';
import { UserPostsComponent } from './pages/user-posts/user-posts.component';
import { UserTodosComponent } from './pages/user-todos/user-todos.component';

export const routes: Routes = [
  { path: '', redirectTo: '/users', pathMatch: 'full' },
  { path: 'users', component: UsersComponent },
  { path: 'user-posts', component: UserPostsComponent },
  { path: 'user-todos', component: UserTodosComponent },
  { path: 'posts', component: PostsComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: '**', redirectTo: '/users' }
];
