import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';

import { UsersComponent } from './users.component';
import { UsersService } from '../../core/services/users/users.service';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let usersService: jasmine.SpyObj<UsersService>;

  const mockUsers = [
    {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      phone: '123-456-7890',
      company: { name: 'Acme Corp' }
    },
    {
      id: 2,
      name: 'Jane Smith',
      username: 'janesmith',
      email: 'jane@example.com',
      phone: '098-765-4321',
      company: { name: 'Tech Inc' }
    }
  ];

  beforeEach(async () => {
    const usersServiceSpy = jasmine.createSpyObj('UsersService', ['getUsers']);

    await TestBed.configureTestingModule({
      providers: [
        { provide: UsersService, useValue: usersServiceSpy },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    usersService = TestBed.inject(UsersService) as jasmine.SpyObj<UsersService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    usersService.getUsers.and.returnValue(of(mockUsers));

    component.ngOnInit();

    expect(usersService.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers).toEqual(mockUsers);
    expect(component.error).toBeNull();
  });

  it('should handle error when loading users fails', () => {
    const error = { status: 500 };
    usersService.getUsers.and.returnValue(throwError(() => error));

    component.ngOnInit();

    expect(component.error).toBe('Server error. Please try again later.');
    expect(component.users).toEqual([]);
    expect(component.filteredUsers).toEqual([]);
  });

  it('should filter users by search term', () => {
    component.users = mockUsers;
    component.filteredUsers = mockUsers;
    component.searchTerm = 'john';

    component.onSearchChange();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].name).toBe('John Doe');
  });

  it('should clear search and reset filtered users', () => {
    component.users = mockUsers;
    component.filteredUsers = [];
    component.searchTerm = 'john';

    component.clearSearch();

    expect(component.searchTerm).toBe('');
    expect(component.filteredUsers).toEqual(mockUsers);
  });

  it('should retry loading users', () => {
    usersService.getUsers.and.returnValue(of(mockUsers));
    component.error = 'Some error';

    component.retry();

    expect(component.error).toBeNull();
    expect(usersService.getUsers).toHaveBeenCalledTimes(1);
  });
});
