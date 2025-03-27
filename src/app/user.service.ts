import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Database, ref, onValue, update } from '@angular/fire/database';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';
import { User } from '@angular/fire/auth';

/**
 * AppUser interface holds additional properties about the user.
 */
export interface AppUser {
  name?: string;
  email?: string;
  isAdmin?: boolean; // <--- This is the key property
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private db: Database | null = null;
  private platformId = inject(PLATFORM_ID);

  constructor() {
    // Only inject Database if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.db = inject(Database);
    }
  }

  /**
   * Saves basic user info (name and email) to the Realtime Database at /users/:uid.
   * Uses update() so that it does NOT overwrite other fields such as isAdmin.
   */
  public async save(user: User): Promise<void> {
    if (!this.db) {
      console.warn('Database is not available (server-side)');
      return;
    }
    const userRef = ref(this.db, `users/${user.uid}`);
    const userData = {
      name: user.displayName,
      email: user.email
    };
    try {
      await update(userRef, userData);
      console.log('User data saved successfully.');
    } catch (error) {
      console.error('Error updating user data:', error);
      throw error;
    }
  }

  /**
   * Retrieves the AppUser object (including isAdmin) from /users/:uid.
   * Returns an Observable that emits the data and updates when changes occur.
   */
  public get(uid: string): Observable<AppUser | null> {
    if (!this.db) {
      console.warn('Database is not available (server-side)');
      return of(null);
    }
    const userRef = ref(this.db, `users/${uid}`);
    return new Observable<AppUser | null>((observer) => {
      const unsubscribe = onValue(
        userRef,
        (snapshot) => {
          if (snapshot.exists()) {
            observer.next(snapshot.val());
          } else {
            observer.next(null);
          }
        },
        (error) => {
          observer.error(error);
        }
      );
      return () => unsubscribe();
    });
  }
}
