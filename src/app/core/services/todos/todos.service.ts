import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class TodosService extends BaseService {

  constructor() {
    super();
  }

  getTodos(params?: { userId: number }) {
    return this.get('todos', params);
  }
}
