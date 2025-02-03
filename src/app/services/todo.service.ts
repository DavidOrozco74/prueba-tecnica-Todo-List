import { HttpClient } from '@angular/common/http';
import { Injectable,  } from '@angular/core';
import { Todo } from '../models/todo';
import { Observable, map } from 'rxjs';
import { environment } from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getTodos(): Observable<Todo[]> {
    return this.http.get<{ data: Todo[] }>(this.apiUrl).pipe(
      map(response => response.data.map(todo => ({
        // Mapea el _id de MongoDB
        _id: todo._id,
        title: todo.title,
        description: todo.description,
        completed: todo.completed
      })))
    );
  }

  addTodo(todo: Omit<Todo, '_id'>): Observable<Todo> { // _id se genera en el servidor
    return this.http.post<{ data: Todo }>(this.apiUrl, todo).pipe(
      map(response => response.data)
    );
  }

  updateTodo(id: string, todo: Todo): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo);
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
