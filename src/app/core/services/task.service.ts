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

    async saveAll(
        tasks: Task[]
    ): Promise<void> {

        await this.storageService.set(
            STORAGE_KEYS.TASKS,
            tasks
        );

    }

}