import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonList, IonItem, IonCheckbox, IonLabel, IonFab, IonFabButton,
  IonModal, IonInput, IonRadioGroup, IonRadio,
  IonSelectOption, IonSelect
} from '@ionic/angular/standalone';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonButton, IonButtons, IonList, IonItem, IonCheckbox,
    IonLabel, IonFab, IonFabButton, IonModal, IonInput, IonRadioGroup, IonRadio,
    IonSelectOption, IonSelect
  ]
})
export class TasksPage {

  tasks: Task[] = [];
  categories: Category[] = [];
  newTaskTitle: string = '';
  selectedCategoryId: string | null = null;
  selectedFilterCategoryId: string | null = null;
  readonly NO_CATEGORY = '__NO_CATEGORY__';
  categoryMap: Record<string, string> = {};

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService
  ) { }

  async ionViewWillEnter() {
    await this.loadCategories();
    await this.loadTasks();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
    this.categories.forEach(category => {
      this.categoryMap[
        category.id
      ] = category.name;
    });
  }

  async loadTasks() {
    this.tasks = await this.taskService.getAll();
    this.tasks.sort((a, b) => b.createdAt - a.createdAt);
  }

  async toggleTask(id: string) {
    await this.taskService.toggleCompleted(id);
    await this.loadTasks();
  }

  async deleteTask(id: string) {
    await this.taskService.delete(id);
    await this.loadTasks();
  }

  async saveTask(modalElement: any) {
    if (!this.newTaskTitle?.trim()) {
      return;
    }
    await this.taskService.create(this.newTaskTitle, this.selectedCategoryId as string);
    this.newTaskTitle = '';
    this.selectedCategoryId = null;
    await this.loadTasks();
    modalElement.dismiss();
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  getCategoryName(
    categoryId?: string
  ) {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return (
      this.categoryMap[categoryId]
      ?? 'Sin categoría'
    );
  }

  get filteredTasks(): Task[] {
    if (this.selectedFilterCategoryId === null) {
      return this.tasks;
    }
    if (
      this.selectedFilterCategoryId ===
      this.NO_CATEGORY
    ) {
      return this.tasks.filter(
        task => !task.categoryId
      );

    }
    return this.tasks.filter(
      task =>
        task.categoryId ===
        this.selectedFilterCategoryId
    );
  }

}