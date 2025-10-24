import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class PostsService extends BaseService {

  constructor() {
    super();
  }

  getPosts(params?: { userId: number }) {
    return this.get(`posts`, params);
  }

  getPostById(postId: number) {
    return this.get(`posts/${postId}`);
  }

  getCommentsByPostId(postId: number) {
    return this.get(`posts/${postId}/comments`);
  }
}
