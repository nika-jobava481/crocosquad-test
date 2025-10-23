import { Injectable } from '@angular/core';
import { BaseService } from '../base.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {

  constructor() {
    super();
  }

  getUsers(params?: {id: number}) {
    return this.get('users', params);
  }

}
