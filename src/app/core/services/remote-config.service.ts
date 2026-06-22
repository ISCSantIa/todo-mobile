import { Injectable } from '@angular/core';

import {
    getRemoteConfig,
    fetchAndActivate,
    getValue
} from 'firebase/remote-config';

import { FirebaseService } from './firebase.service';


@Injectable({
    providedIn: 'root'
})
export class RemoteConfigService {


    private remoteConfig;


    constructor(
        private firebaseService: FirebaseService
    ) {


        this.remoteConfig =
            getRemoteConfig(
                this.firebaseService.firebaseApp
            );


        this.remoteConfig.settings = {

            minimumFetchIntervalMillis: 0,

            fetchTimeoutMillis: 5000

        };

        this.remoteConfig.defaultConfig = {
            'enable_categories': false
        };


    }



    async initialize() {

        await fetchAndActivate(
            this.remoteConfig
        );

    }



    isCategoriesEnabled(): boolean {
        return getValue(
            this.remoteConfig,
            'enable_categories'
        )
            .asBoolean();


    }


}