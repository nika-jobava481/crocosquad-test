import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { TodosService } from './todos.service';

describe('TodosService', () => {
  let service: TodosService;
  let httpMock: HttpTestingController;

  const mockTodos = [
    {
      id: 1,
      userId: 1,
      title: 'Test todo 1',
      completed: false
    },
    {
      id: 2,
      userId: 1,
      title: 'Test todo 2',
      completed: true
    }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TodosService, provideHttpClient(), provideHttpClientTesting()]
    });
    service = TestBed.inject(TodosService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get todos for a specific user', () => {
    const userId = 1;

    service.getTodos({ userId }).subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should get todos without parameters', () => {
    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne('https://jsonplaceholder.typicode.com/todos');
    expect(req.request.method).toBe('GET');
    req.flush(mockTodos);
  });

  it('should handle API errors', () => {
    const userId = 1;

    service.getTodos({ userId }).subscribe({
      next: () => fail('should have failed'),
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
