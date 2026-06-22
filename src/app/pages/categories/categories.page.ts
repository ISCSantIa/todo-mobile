import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonList, IonItem, IonLabel, IonButton, IonFab, IonFabButton } from '@ionic/angular/standalone';
import { CategoryService } from '../../core/services/category.service';
import { Category } from '../../models/category.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  imports: [RouterLink, IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonList, IonItem, IonLabel, IonFab, IonFabButton, IonButton, IonButtons]
})
export class CategoriesPage {

  categories: Category[] = [];

  constructor(
    private categoryService: CategoryService
  ) { }

  async ionViewWillEnter() {

    await this.loadCategories();

  }

  async loadCategories() {
    this.categories = await this.categoryService.getAll();
  }

  async createCategory() {
    const name = prompt("Nombre categoría");
    if (!name) {
      return;
    }
    await this.categoryService.create(name);
    await this.loadCategories();
  }

  async deleteCategory(
    id: string
  ) {
    await this.categoryService.delete(id);
    await this.loadCategories();
  }

  async editCategory(
    category: Category
  ) {
    const name =
      prompt(
        "Nuevo nombre",
        category.name
      );
    if (!name) {
      return;
    }
    await this.categoryService.update({
      ...category,
      name
    });
    await this.loadCategories();
  }

}
