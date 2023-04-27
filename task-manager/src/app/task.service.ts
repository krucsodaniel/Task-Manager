import { Injectable } from '@angular/core';
import { WebRequestService } from './web-request.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(private webReqService: WebRequestService) {}

  createList(title: string, ownerId: any) {
    return this.webReqService.post('lists', { title, ownerId });
  }

  getLists(ownerId: any) {
    return this.webReqService.getAll('lists', `${ownerId}`);
  }

  deleteList(listId: string) {
    return this.webReqService.deleteList(`lists/${listId}`);
  }

  getTasks(listId: string) {
    return this.webReqService.getById(`lists/${listId}/tasks`);
  }

  createTask(title: string, listId: string) {
    return this.webReqService.createTeask(`lists/${listId}/tasks`, { title });
  }

  deleteTask(listId: string, taskId: string) {
    return this.webReqService.deleteTask(`lists/${listId}/tasks/${taskId}`);
  }

  complete(task: any) {
    return this.webReqService.completeTask(
      `lists/${task._listId}/tasks/${task._id}`,
      {
        completed: !task.completed,
      }
    );
  }
}
