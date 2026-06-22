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

    async create(
        name: string
    ): Promise<void> {

        if (!name.trim()) {
            return;
        }

        const categories = await this.getAll();

        const exists =
            categories.some(
                item =>
                    item.name.toLowerCase()
                    === name.toLowerCase()
            );

        if (exists) {
            return;
        }

        const newCategory: Category = {

            id: crypto.randomUUID(),

            name

        };


        categories.push(newCategory);


        await this.saveAll(categories);

    }

    async update(
        category: Category
    ): Promise<void> {


        const categories = await this.getAll();


        const index = categories.findIndex(
            item => item.id === category.id
        );


        if (index === -1) {
            return;
        }


        categories[index] = category;


        await this.saveAll(categories);

    }

    async delete(
        id: string
    ): Promise<void> {
        const categories = await this.getAll();
        const filtered = categories.filter(
            item => item.id !== id
        );
        await this.saveAll(filtered);

    }

    async saveAll(
        categories: Category[]
    ): Promise<void> {

        await this.storageService.set(
            STORAGE_KEYS.CATEGORIES,
            categories
        );

    }

}