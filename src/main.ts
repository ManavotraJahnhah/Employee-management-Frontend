import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app';

// Point d'entrée Angular : bootstrap de l'application en mode standalone
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
