import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, IonList, IonItem, IonCheckbox, IonLabel, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { Task } from '../../models/task.model';
import { TaskService } from '../../core/services/task.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonButtons, IonList, IonItem, IonCheckbox, IonLabel, IonFab, IonFabButton,]
})
export class TasksPage {

  tasks: Task[] = [];

  constructor(
    private taskService: TaskService
  ) { }

  async ionViewWillEnter() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks =
      await this.taskService.getAll();
    this.tasks.sort(
      (a, b) =>
        b.createdAt - a.createdAt
    );
  }

  async toggleTask(
    id: string
  ) {
    await this.taskService.toggleCompleted(id);
    await this.loadTasks();
  }

  async createTask() {
    const title =
      prompt(
        "Nueva tarea"
      );
    if (!title) {
      return;
    }
    await this.taskService.create(
      title
    );
    await this.loadTasks();
  }

  async deleteTask(
    id: string
  ) {
    await this.taskService.delete(id);
    await this.loadTasks();
  }

  trackByTask(
    index: number,
    task: Task
  ) {
    return task.id;
  }

}
