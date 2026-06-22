import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Task } from '../../models/task.model';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    constructor(
        private storageService: StorageService
    ) { }

    async getAll(): Promise<Task[]> {

        return (
            await this.storageService.get<Task[]>(
                STORAGE_KEYS.TASKS
            )
        ) ?? [];

    }

    async create(
        title: string,
        categoryId?: string
    ): Promise<void> {
        const tasks =
            await this.getAll();
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            categoryId,
            createdAt: Date.now()
        };
        tasks.push(newTask);
        await this.saveAll(tasks);
    }

    async toggleCompleted(
        id: string
    ): Promise<void> {
        const tasks =
            await this.getAll();
        const task =
            tasks.find(
                item => item.id === id
            );
        if (!task) {
            return;
        }
        task.completed =
            !task.completed;
        await this.saveAll(tasks);
    }

    async delete(
        id: string
    ): Promise<void> {
        const tasks =
            await this.getAll();
        const filtered =
            tasks.filter(
                item => item.id !== id
            );
        await this.saveAll(filtered);
    }

    async saveAll(
        tasks: Task[]
    ): Promise<void> {

        await this.storageService.set(
            STORAGE_KEYS.TASKS,
            tasks
        );

    }

}