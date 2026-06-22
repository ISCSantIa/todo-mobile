import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/**
 * Centraliza toda la persistencia local.
 * Permite reemplazar Preferences por
 * SQLite o IndexedDB sin afectar
 * los servicios de dominio.
 */
@Injectable({
    providedIn: 'root'
})
export class StorageService {

    async get<T>(key: string): Promise<T | null> {

        const result = await Preferences.get({ key });

        if (!result.value) {
            return null;
        }

        return JSON.parse(result.value) as T;
    }

    async set<T>(key: string, value: T): Promise<void> {

        await Preferences.set({
            key,
            value: JSON.stringify(value)
        });

    }

    async remove(key: string): Promise<void> {

        await Preferences.remove({ key });

    }

}