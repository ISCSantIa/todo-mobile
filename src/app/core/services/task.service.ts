import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Task } from '../../models/task.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TaskService {

    private tasksCache: Task[] = [];
    private tasksSubject = new BehaviorSubject<Task[]>([]);
    tasks$ = this.tasksSubject.asObservable();

    constructor(
        private storageService: StorageService
    ) { }

    async initialize() {
        this.tasksCache =
            await this.getAllFromStorage();
        this.emitChanges();

    }

    private async getAllFromStorage() {
        return (
            await this.storageService.get<Task[]>(
                STORAGE_KEYS.TASKS
            )
        ) ?? [];
    }

    private emitChanges() {
        this.tasksSubject.next([...this.tasksCache]);
    }

    getTasks() {
        return this.tasksCache;
    }

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
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            categoryId,
            createdAt: Date.now()
        };
        this.tasksCache.push(newTask);
        this.emitChanges();
        await this.saveAll(this.tasksCache);
    }

    async toggleCompleted(
        id: string
    ): Promise<void> {
        const task =
            this.tasksCache.find(
                item => item.id === id
            );
        if (!task) return;
        task.completed = !task.completed;
        this.emitChanges();
        await this.saveAll(this.tasksCache);
    }

    async delete(
        id: string
    ): Promise<void> {
        this.tasksCache = this.tasksCache.filter(item => item.id !== id);
        this.emitChanges();
        await this.saveAll(this.tasksCache);
    }

    async saveAll(
        tasks: Task[]
    ): Promise<void> {

        this.tasksCache = [...tasks];
        this.emitChanges();
        await this.storageService.set(STORAGE_KEYS.TASKS, tasks);
    }

}