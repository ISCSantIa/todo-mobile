import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
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
import { FeatureService } from '../../core/services/feature.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonButton, IonButtons, IonList, IonItem, IonCheckbox,
    IonLabel, IonFab, IonFabButton, IonModal, IonInput, IonRadioGroup, IonRadio,
    IonSelectOption, IonSelect, AsyncPipe
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TasksPage {

  categories: Category[] = [];
  newTaskTitle: string = '';
  selectedCategoryId: string | null = null;
  selectedFilterCategoryId: string | null = null;
  readonly NO_CATEGORY = '__NO_CATEGORY__';
  categoryMap: Record<string, string> = {};

  tasks$ = this.taskService.tasks$;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    public featureService: FeatureService
  ) { }

  async ionViewWillEnter() {
    try {
      const [categoriesData, _] = await Promise.all([
        this.categoryService.getAll(),
        this.taskService.initialize()
      ]);

      this.categories = categoriesData;
      this.categoryMap = {};
      this.categories.forEach(category => {
        this.categoryMap[category.id] = category.name;
      });

    } catch (error) {
      console.error('Error en la carga inicial optimizada:', error);
    }
  }

  async toggleTask(id: string) {
    await this.taskService.toggleCompleted(id);
  }

  async deleteTask(id: string) {
    await this.taskService.delete(id);
  }

  async saveTask(modalElement: any) {
    if (!this.newTaskTitle?.trim()) {
      return;
    }
    await this.taskService.create(this.newTaskTitle, this.selectedCategoryId as string);
    this.newTaskTitle = '';
    this.selectedCategoryId = null;
    modalElement.dismiss();
  }

  trackByTask(index: number, task: Task) {
    return task.id;
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) {
      return 'Sin categoría';
    }
    return this.categoryMap[categoryId] ?? 'Sin categoría';
  }

  filterTasksList(tasks: Task[] | null): Task[] {
    if (!tasks) return [];

    const sorted = [...tasks].sort((a, b) => b.createdAt - a.createdAt);

    if (this.selectedFilterCategoryId === null) {
      return sorted;
    }
    if (this.selectedFilterCategoryId === this.NO_CATEGORY) {
      return sorted.filter(task => !task.categoryId);
    }
    return sorted.filter(task => task.categoryId === this.selectedFilterCategoryId);
  }

  get categoriesEnabled() {
    return this.featureService.categoriesEnabled;
  }
}