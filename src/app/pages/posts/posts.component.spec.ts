import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of } from 'rxjs';

import { PostsComponent } from './posts.component';
import { PostsService } from '../../core/services/posts/posts.service';

describe('PostsComponent', () => {
  let component: PostsComponent;
  let fixture: ComponentFixture<PostsComponent>;
  let postsService: jasmine.SpyObj<PostsService>;

  beforeEach(async () => {
    const postsServiceSpy = jasmine.createSpyObj('PostsService', ['getPosts', 'getPostById']);

    await TestBed.configureTestingModule({
      imports: [PostsComponent],
      providers: [
        { provide: PostsService, useValue: postsServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(PostsComponent);
    component = fixture.componentInstance;
    postsService = TestBed.inject(PostsService) as jasmine.SpyObj<PostsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.currentPage).toBe(1);
    expect(component.itemsPerPage).toBe(10);
    expect(component.totalPages).toBe(0);
    expect(component.totalItems).toBe(0);
    expect(component.isModalOpen).toBe(false);
    expect(component.selectedPost).toBeNull();
  });

  it('should open post modal', () => {
    const mockPost = { id: 1, title: 'Test Post', body: 'Test Body', userId: 1, userName: 'John Doe', userUsername: 'john.doe', userEmail: 'john.doe@example.com' };
    const mockDetailedPost = { ...mockPost, userName: 'John Doe', userUsername: 'john.doe', userEmail: 'john.doe@example.com' };

    postsService.getPostById.and.returnValue(of(mockDetailedPost));

    component.openPostModal(mockPost);

    expect(postsService.getPostById).toHaveBeenCalledWith(1);
    expect(component.selectedPost).toEqual(mockDetailedPost);
    expect(component.isModalOpen).toBe(true);
  });

  it('should close post modal', () => {
    component.isModalOpen = true;
    component.selectedPost = { id: 1, title: 'Test' };

    component.closePostModal();

    expect(component.isModalOpen).toBe(false);
    expect(component.selectedPost).toBeNull();
  });

  it('should navigate to next page', () => {
    component.currentPage = 1;
    component.totalPages = 3;
    component.filteredPosts = new Array(25).fill({});

    component.nextPage();

    expect(component.currentPage).toBe(2);
  });

  it('should navigate to previous page', () => {
    component.currentPage = 2;
    component.totalPages = 3;

    component.previousPage();

    expect(component.currentPage).toBe(1);
  });

  it('should not navigate beyond page limits', () => {
    component.currentPage = 3;
    component.totalPages = 3;

    component.nextPage();

    expect(component.currentPage).toBe(3); // Should not change
  });

  it('should return minimum of two numbers', () => {
    expect(component.getMin(5, 10)).toBe(5);
    expect(component.getMin(10, 5)).toBe(5);
    expect(component.getMin(5, 5)).toBe(5);
  });
});
