import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// ✅ Correct Firebase Imports (Ensure Proper Initialization)
import { initializeApp, FirebaseOptions, FirebaseApp } from 'firebase/app';
import { provideFirebaseApp, getApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';

import { environment } from '../environments/environment';
import { routes } from './app.routes';
import { provideDatabase } from '@angular/fire/database';
import { getDatabase } from 'firebase/database';

export function createFirebaseApp(): FirebaseApp {
  return initializeApp(environment.firebase as FirebaseOptions);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),

    // ✅ Ensure Firebase Providers Are Wrapped in `importProvidersFrom()`
    provideFirebaseApp(() => createFirebaseApp()), // ✅ Using Separate Function Fixes TS2345
   // provideAuth(() => getAuth(getApp())), // ✅ Fixes Firebase App Reference Issue
    provideFirestore(() => getFirestore(getApp())), // ✅ Fixes Firebase App Reference Issue
    provideAuth(() => getAuth()), // ✅ Ensure Auth is Provided
    provideDatabase (()=> getDatabase())
  ]
};
