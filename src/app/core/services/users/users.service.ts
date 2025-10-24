import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseService } from '../base.service';
import { User } from '../../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UsersService extends BaseService {

  constructor() {
    super();
  }

  getUsers(params?: { id: number }): Observable<User[]> {
    return this.get<User[]>('users', params);
  }

}
