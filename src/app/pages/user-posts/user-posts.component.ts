import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../core/services/posts/posts.service';
import { UsersService } from '../../core/services/users/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, map, forkJoin } from 'rxjs';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-user-posts',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './user-posts.component.html',
  styleUrl: './user-posts.component.scss'
})
export class UserPostsComponent implements OnInit {
  private readonly postsService = inject(PostsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly usersService = inject(UsersService);
  posts: any[] = [];
  userId: number = 0;
  user: any = null;
  selectedPost: any = null;
  isModalOpen: boolean = false;
  userNotFound: boolean = false;

  private generateRandomData(post: any, user: any, comments: any[] = []): any {
    const times = ['2h', '5h', '1d', '2d', '3d', '1w', '2w'];
    const commentCount = comments.length;
    const minLikes = Math.max(1, commentCount - 2);
    const maxLikes = commentCount * 6;
    
    return {
      ...post,
      userName: user ? user.name : 'Unknown User',
      userUsername: user ? user.username : 'unknown',
      userEmail: user ? user.email : 'unknown@email.com',
      randomLikes: Math.floor(Math.random() * (maxLikes - minLikes + 1)) + minLikes,
      randomComments: commentCount,
      randomTime: times[Math.floor(Math.random() * times.length)],
      isLiked: false,
      comments: comments
    };
  }

  toggleLike(post: any): void {
    if (post.isLiked) {
      // Unlike: decrease count and mark as not liked
      post.randomLikes--;
      post.isLiked = false;
    } else {
      // Like: increase count and mark as liked
      post.randomLikes++;
      post.isLiked = true;
    }
  }

  openCommentModal(post: any): void {
    this.selectedPost = post;
    this.isModalOpen = true;
  }

  closeCommentModal(): void {
    this.isModalOpen = false;
    this.selectedPost = null;
  }

  goBack(): void {
    this.router.navigate(['/users']);
  }

  ngOnInit(): void {
    this.route.queryParams.pipe(
      switchMap((params: any) => {
        this.userId = params['userId'];
        
        // Check if userId exists and is valid, if not redirect to users page
        if (!this.userId || this.userId <= 0) {
          this.router.navigate(['/users']);
          return [];
        }
        
        // Second request: get posts after queryParams completes
        return this.postsService.getPosts({ userId: this.userId });
      }),
      switchMap((posts: any) => {
        // Third request: get user info after posts complete
        return this.usersService.getUsers({ id: this.userId }).pipe(
          map((users: any) => {
            // Check if user was found
            if (!users || users.length === 0 || !users[0]) {
              this.userNotFound = true;
              return { posts: [], user: null };
            }
            return { posts, user: users[0] };
          })
        );
      }),
      switchMap(({ posts, user }) => {
        // Fourth request: get comments for each post
        const commentRequests = posts.map((post: any) => 
          this.postsService.getCommentsByPostId(post.id).pipe(
            map((comments: any) => ({ post, comments }))
          )
        );
        
        return forkJoin(commentRequests).pipe(
          map((postComments) => ({ posts, user, postComments }))
        );
      })
    ).subscribe(({ posts, user, postComments }:any) => {
      this.user = user;
      this.posts = posts.map((post: any) => {
        const postWithComments = postComments.find((pc: any) => pc.post.id === post.id);
        return this.generateRandomData(post, user, postWithComments?.comments || []);
      });
      console.log('Posts with comments:', this.posts);
      console.log('User info:', user);
    });
  }

}
