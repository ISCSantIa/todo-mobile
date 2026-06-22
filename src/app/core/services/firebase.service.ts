import { Injectable } from '@angular/core';

import { initializeApp } from 'firebase/app';

import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FirebaseService {

    private app;

    constructor() {

        this.app = initializeApp(
            environment.firebase
        );

    }

    get firebaseApp() {

        return this.app;

    }

}