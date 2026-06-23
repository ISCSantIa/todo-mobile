import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton,
  IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton,
  IonIcon
} from '@ionic/angular/standalone';
import { CategoryService } from '../../core/services/category.service';
import { CategoryManagerService } from '../../core/services/category-manager.service';
import { Category } from '../../models/category.model';
import { RouterLink } from '@angular/router';
import { AlertController } from '@ionic/angular/standalone';
import { UiService } from '../../core/services/ui.service';
import { createOutline, trashOutline, folderOpenOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [
    RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule,
    FormsModule, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonButton,
    IonButtons, IonBackButton, IonIcon
  ]
})
export class CategoriesPage {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService,
    private categoryManagerService: CategoryManagerService,
    private alertController: AlertController,
    private uiService: UiService
  ) {
    addIcons({ createOutline, trashOutline, folderOpenOutline });
  }

  async ionViewWillEnter() {
    await this.loadCategories();
  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  async deleteCategory(id: string) {
    await this.categoryManagerService.deleteCategory(id);
    await this.loadCategories();
    await this.uiService.showToast('Categoría eliminada', 'danger');
  }

  async confirmDeleteCategory(id: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar categoría',
      message: '¿Deseas eliminar esta categoría? Las tareas asociadas a ella pasarán a quedar "Sin categoría".',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.deleteCategory(id);
          }
        }
      ]
    });
    await alert.present();
  }

  async editCategory(category: Category) {
    const alert = await this.alertController.create({
      header: 'Editar Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          value: category.name,
          placeholder: 'Nombre de la categoría'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.name?.trim()) {
              return false;
            }

            await this.categoryService.update({
              ...category,
              name: data.name.trim()
            });

            await this.loadCategories();
            await this.uiService.showToast('Categoría actualizada');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async openCreateCategoryModal() {
    const alert = await this.alertController.create({
      header: 'Nueva Categoría',
      inputs: [
        {
          name: 'name',
          type: 'text',
          placeholder: 'Ej. Universidad, Trabajo...'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Guardar',
          handler: async (data) => {
            if (!data.name?.trim()) {
              return false;
            }
            await this.categoryService.create(data.name.trim());
            await this.loadCategories();
            await this.uiService.showToast('Categoría creada');
            return true;
          }
        }
      ]
    });

    await alert.present();
  }
}