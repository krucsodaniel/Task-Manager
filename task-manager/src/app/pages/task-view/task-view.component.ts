import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CountdownService } from 'src/app/countdown.service';
import { List } from 'src/app/models/list.model';
import { Task } from 'src/app/models/task.model';
import { TaskService } from 'src/app/task.service';

@Component({
  selector: 'app-task-view',
  templateUrl: './task-view.component.html',
  styleUrls: ['./task-view.component.scss'],
})
export class TaskViewComponent implements OnInit {
  lists?: any;
  tasks?: any;

  selectedListId?: string;

  countdownDisplay?: string;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router,
    private countdownService: CountdownService
  ) {}

  btnActive = true;

  ngOnInit(): void {
    this.getTasks();

    this.getLists();

    this.countdownService.countdownDisplay$.subscribe(
      (countdownDisplay: string) => {
        this.countdownDisplay = countdownDisplay;
      }
    );
  }

  getTasks() {
    this.route.params.subscribe((params: Params) => {
      if (params['listId']) {
        this.selectedListId = params['listId'];
        this.taskService.getTasks(params['listId']).subscribe((tasks: any) => {
          this.tasks = tasks;
        });
      } else {
        this.tasks = undefined;
        this.btnActive = false;
      }
    });
  }

  getLists() {
    let ownerId = localStorage.getItem('ownerId');
    this.taskService.getLists(ownerId).subscribe((lists: any) => {
      this.lists = lists;
    });
  }

  onTaskClick(task: Task) {
    this.taskService.complete(task).subscribe((data) => {
      task.completed = !task.completed;
    });
  }

  deleteTask(task: any) {
    let _listId = task._listId;
    let _taskId = task._id;
    this.taskService.deleteTask(_listId, _taskId).subscribe((data) => {
      this.getTasks();
    });
  }

  deleteList(list: any) {
    const input = prompt(
      `WARNING! Deleting "${list.title}" will also remove all the Tasks inside it! If you are sure, you would like to delete the List, type 'DELETE' to confirm deletion:`
    );

    if (input === 'DELETE') {
      let listId = list._id;
      this.taskService.deleteList(listId).subscribe((data) => {
        this.getLists();
        this.getTasks();
      });
    }
  }
}
