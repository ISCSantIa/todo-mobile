import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons,
  IonList, IonItem, IonCheckbox, IonLabel, IonFab, IonFabButton,
  IonModal, IonInput, IonRadioGroup, IonRadio,
  IonSelectOption, IonSelect,
  IonIcon,
  IonBadge
} from '@ionic/angular/standalone';
import { Task } from '../../models/task.model';
import { Category } from '../../models/category.model';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { FeatureService } from '../../core/services/feature.service';
import { AlertController } from '@ionic/angular/standalone';
import { UiService } from '../../core/services/ui.service';
import { add, trashOutline, clipboardOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonButton, IonButtons, IonList, IonItem, IonCheckbox,
    IonLabel, IonFab, IonFabButton, IonModal, IonInput, IonRadioGroup, IonRadio,
    IonSelectOption, IonSelect, AsyncPipe, IonIcon, IonIcon
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
    public featureService: FeatureService,
    private alertController: AlertController,
    private uiService: UiService
  ) {
    addIcons({ add, trashOutline, clipboardOutline });
  }

  async ionViewWillEnter() {
    try {
      await this.uiService.showLoading('Sincronizando datos...');
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
    } finally {
      await this.uiService.dismissLoading();
    }
  }

  async toggleTask(id: string) {
    await this.taskService.toggleCompleted(id);
  }

  async deleteTask(id: string) {
    await this.taskService.delete(id);
    await this.uiService.showToast('Tarea eliminada', 'danger');
  }

  async confirmDeleteTask(id: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar tarea',
      message: '¿Estás seguro de que deseas eliminar esta tarea? Esta acción no se puede deshacer.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.deleteTask(id);
          }
        }
      ]
    });

    await alert.present();
  }

  async saveTask(modalElement: any) {
    if (!this.newTaskTitle?.trim()) {
      return;
    }
    await this.taskService.create(this.newTaskTitle, this.selectedCategoryId as string);
    this.newTaskTitle = '';
    this.selectedCategoryId = null;
    modalElement.dismiss();
    await this.uiService.showToast('Tarea creada con éxito');
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