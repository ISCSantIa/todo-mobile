import { Injectable } from '@angular/core';

import { RemoteConfigService }
    from './remote-config.service';


@Injectable({
    providedIn: 'root'
})
export class FeatureService {


    constructor(
        private remoteConfigService:
            RemoteConfigService
    ) { }



    get categoriesEnabled() {

        return this.remoteConfigService
            .isCategoriesEnabled();

    }


}