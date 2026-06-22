import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { STORAGE_KEYS } from '../constants/storage.constants';
import { Category } from '../../models/category.model';

@Injectable({
    providedIn: 'root'
})
export class CategoryService {

    constructor(
        private storageService: StorageService
    ) { }

    async getAll(): Promise<Category[]> {

        return (
            await this.storageService.get<Category[]>(
                STORAGE_KEYS.CATEGORIES
            )
        ) ?? [];

    }

    async saveAll(
        categories: Category[]
    ): Promise<void> {

        await this.storageService.set(
            STORAGE_KEYS.CATEGORIES,
            categories
        );

    }

    async seed(): Promise<void> {

        const categories = await this.getAll();

        if (categories.length > 0) {
            return;
        }

        await this.saveAll([
            {
                id: crypto.randomUUID(),
                name: 'Trabajo'
            },
            {
                id: crypto.randomUUID(),
                name: 'Personal'
            },
            {
                id: crypto.randomUUID(),
                name: 'Estudio'
            }
        ]);

    }

}