import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostsService } from '../../core/services/posts/posts.service';
import { UsersService } from '../../core/services/users/users.service';
import { combineLatest, map } from 'rxjs';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-posts',
  imports: [CommonModule, LoaderComponent],
  templateUrl: './posts.component.html',
  styleUrl: './posts.component.scss'
})
export class PostsComponent implements OnInit {

  private readonly postsService = inject(PostsService);
  private readonly usersService = inject(UsersService);

  users: any[] = [];
  posts: any[] = [];
  filteredPosts: any[] = [];
  paginatedPosts: any[] = [];
  selectedPost: any = null;
  isModalOpen: boolean = false;
  
  // Pagination properties
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 0;
  totalItems: number = 0;

  openPostModal(post: any): void {
    // Fetch detailed post data
    this.postsService.getPostById(post.id).subscribe((detailedPost: any) => {
      this.selectedPost = {
        ...detailedPost,
        userName: post.userName,
        userUsername: post.userUsername,
        userEmail: post.userEmail
      };
      this.isModalOpen = true;
    });
  }

  closePostModal(): void {
    this.isModalOpen = false;
    this.selectedPost = null;
  }

  ngOnInit(): void {
    // Use RxJS combineLatest to merge both API calls and transform data
    combineLatest([
      this.postsService.getPosts(),
      this.usersService.getUsers()
    ]).pipe(
      map(([posts, users]: [any, any]) => 
        posts.map((post: any) => {
          const user = users.find((user: any) => user.id === post.userId);
          return {
            ...post,
            userName: user ? user.name : 'Unknown',
            userUsername: user ? user.username : 'Unknown',
            userEmail: user ? user.email : 'Unknown'
          };
        })
      )
    ).subscribe((mergedPosts) => {
      this.posts = mergedPosts;
      this.filteredPosts = mergedPosts;
      this.updatePagination();
      console.log('Merged posts with user data:', this.posts);
    });
  }

  updatePagination() {
    this.totalItems = this.filteredPosts.length;
    this.totalPages = Math.ceil(this.totalItems / this.itemsPerPage);
    
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedPosts = this.filteredPosts.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = window.innerWidth <= 768 ? 3 : 5; // Fewer pages on mobile
    let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(this.totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }

  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

}
