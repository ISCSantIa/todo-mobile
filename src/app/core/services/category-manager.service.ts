import { Injectable } from '@angular/core';

import { CategoryService } from './category.service';
import { TaskService } from './task.service';

@Injectable({
    providedIn: 'root'
})
export class CategoryManagerService {

    constructor(
        private categoryService: CategoryService,
        private taskService: TaskService
    ) { }

    async deleteCategory(
        categoryId: string
    ): Promise<void> {
        const tasks =
            await this.taskService.getAll();
        const updatedTasks =
            tasks.map(task => {
                if (task.categoryId === categoryId) {
                    return {
                        ...task,
                        categoryId: undefined
                    };
                }
                return task;
            });
        await this.taskService.saveAll(
            updatedTasks
        );
        await this.categoryService.delete(
            categoryId
        );
    }
}