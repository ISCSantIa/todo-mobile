import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { FirebaseService } from './core/services/firebase.service';
import { RemoteConfigService } from './core/services/remote-config.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor(
    private firebaseService: FirebaseService,
    private remoteConfigService: RemoteConfigService
  ) { }

  async ngOnInit() {

    await this.remoteConfigService.initialize();

  }
}
