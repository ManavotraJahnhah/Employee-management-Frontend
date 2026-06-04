import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';

// Configuration de l'application Angular: providers globaux
// - provideBrowserGlobalErrorListeners : capture les erreurs non gérées
// - provideRouter : enregistre le routeur avec les routes déclarées
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes)
  ]
};
