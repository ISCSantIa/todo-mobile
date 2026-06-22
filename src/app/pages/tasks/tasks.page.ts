import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons } from '@ionic/angular/standalone';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonButtons, CommonModule, FormsModule]
})
export class TasksPage implements OnInit {

  constructor(
    private categoryService: CategoryService
  ) { }

  async ngOnInit() {
    await this.categoryService.seed();
    console.log(
      await this.categoryService.getAll()
    );

  }

}
