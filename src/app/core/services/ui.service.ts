import { Injectable } from '@angular/core';
import { ToastController, LoadingController } from '@ionic/angular/standalone';

@Injectable({
    providedIn: 'root'
})
export class UiService {

    private currentLoading: HTMLIonLoadingElement | null = null;

    constructor(private toastController: ToastController, private loadingController: LoadingController) { }

    async showToast(message: string, color: 'success' | 'danger' | 'warning' = 'success') {
        const toast = await this.toastController.create({
            message,
            duration: 2000,
            position: 'bottom',
            color: color,
            buttons: [
                {
                    text: 'OK',
                    role: 'cancel'
                }
            ]
        });

        await toast.present();
    }

    async showLoading(message: string = 'Cargando...') {
        if (this.currentLoading) return;

        this.currentLoading = await this.loadingController.create({
            message,
            spinner: 'circles',
            translucent: true,
            backdropDismiss: false
        });

        await this.currentLoading.present();
    }

    async dismissLoading() {
        if (this.currentLoading) {
            await this.currentLoading.dismiss();
            this.currentLoading = null;
        }
    }

}