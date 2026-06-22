import { APP_INITIALIZER } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component';

import { RemoteConfigService } from './app/core/services/remote-config.service';

bootstrapApplication(AppComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),

    {
      provide: APP_INITIALIZER,
      useFactory: (remoteConfigService: RemoteConfigService) => {
        return () => remoteConfigService.initialize();
      },
      deps: [RemoteConfigService],
      multi: true
    }
  ],
});