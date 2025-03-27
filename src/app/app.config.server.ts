import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServerRouting } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app'; // Add this
import { provideAuth, getAuth } from '@angular/fire/auth'; // Add this
import { environment } from '../environments/environment'; // Add this

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // Add Firebase providers for SSR
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth())
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);