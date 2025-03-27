import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { isPlatformBrowser } from '@angular/common';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { user } from '@angular/fire/auth';
import { UserService, AppUser } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private auth: Auth | null = null;

  // Emits the raw Firebase user (or null if not logged in)
  user$: Observable<User | null>;

  // Emits our custom user object from the DB (including isAdmin)
  appUser$: Observable<AppUser | null>;

  constructor(private userService: UserService) {
    // Only inject Auth if running in the browser
    if (isPlatformBrowser(this.platformId)) {
      this.auth = inject(Auth);
    }
    // If auth exists, use AngularFire's user() helper; otherwise, emit null.
    this.user$ = this.auth ? user(this.auth) : of(null);
    // Map raw Firebase user to custom AppUser from the DB.
    this.appUser$ = this.user$.pipe(
      switchMap((fbUser: User | null) => {
        if (!fbUser) return of(null);
        return this.userService.get(fbUser.uid);
      })
    );
  }

  // Google sign-in method (popup)
  async loginWithGoogle(): Promise<User | null> {
    if (!this.auth) {
      console.warn('Firebase Auth is not available (likely server-side)');
      return null;
    }
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(this.auth, provider);
      return result.user;
    } catch (error) {
      console.error('Error during Google login:', error);
      throw error;
    }
  }

  // Sign-out method
  async logout(): Promise<void> {
    if (!this.auth) return;
    await this.auth.signOut();
  }
}
