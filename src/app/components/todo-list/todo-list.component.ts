import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2';
import { Todo } from '../../models/todo';
import { TodoService } from '../../services/todo.service';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, SweetAlert2Module],
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  todos: Todo[] = [];
  newTodoTitle: string = '';
  newTodoDescription: string = '';
  newTodoState: boolean = false;

  constructor(private todoService: TodoService) {}

  ngOnInit(): void {
    this.loadTodos();
  }

  private loadTodos(): void {
    this.todoService.getTodos().subscribe({
      next: (data) => (this.todos = data),
      error: (error) => console.error('Error al cargar tareas:', error),
    });
  }

  addTodo(): void {
    if (!this.newTodoTitle.trim()) return;
  
    const newTodo: Todo = {
      title: this.newTodoTitle.trim(),
      description: this.newTodoDescription.trim(), // Asegúrate de incluir esto
      completed: this.newTodoState
    };
  
    this.todoService.addTodo(newTodo).subscribe({
      next: (todo) => {
        this.todos = [...this.todos, todo];
        this.newTodoTitle = '';
        this.newTodoDescription = ''; // Limpiar también la descripción
  
        // Mostrar notificación de éxito con SweetAlert2
        Swal.fire({
          title: '¡Tarea creada!',
          text: 'La tarea ha sido agregada correctamente.',
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al agregar tarea:', error);
  
        // Opcional: Mostrar notificación de error si algo falla
        Swal.fire({
          title: 'Error',
          text: 'No se pudo agregar la tarea.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

   // Método para obtener el texto del estado
   getEstadoTexto(): string {
    return this.newTodoState ? 'Terminada' : 'Por hacer';
  }

  toggleTodo(todo: Todo): void {
    this.todoService.updateTodo(todo._id!, { 
      ...todo,
      completed: todo.completed // Cambia el estado
    }).subscribe({
      next: () => {
        todo.completed = todo.completed; // Actualiza el estado localmente
  
        // Mostrar notificación de éxito
        Swal.fire({
          title: '¡Estado actualizado!',
          text: `La tarea "${todo.title}" ha sido marcada como ${todo.completed ? 'terminada' : 'por hacer'}.`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error) => {
        console.error('Error al actualizar tarea:', error);
  
        // Mostrar notificación de error
        Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar el estado de la tarea.',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  deleteTodo(id: string): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar!',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.todoService.deleteTodo(id).subscribe({
          next: () => {
            this.todos = this.todos.filter((todo) => todo._id !== id); 
            Swal.fire(
              'Eliminado!',
              'Tu tarea ha sido eliminada.',
              'success'
            );
          },
          error: (error) => {
            console.error('Error al eliminar tarea:', error);
            Swal.fire(
              'Error',
              'No se pudo eliminar la tarea',
              'error'
            );
          }
        });
      }
    });
  }
 
  trackByTodo(index: number, todo: Todo): string { // Retorna el _id
    return todo._id!;
  }

}