import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue } from 'firebase/database';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private db: any;

  constructor() {
    const firebaseConfig = {
      apiKey: "AIzaSyD0kHSqs2jPmUGBAR0wkwVKJVL5A5D9Ujc",
      authDomain: "oshop-c774e.firebaseapp.com",
      projectId: "oshop-c774e",
      storageBucket: "oshop-c774e.firebasestorage.app",
      messagingSenderId: "519843568303",
      appId: "1:519843568303:web:70817a81b1ede23726125a",
      measurementId: "G-PRESEFLFFQ"
    };
    console.log('Initializing Firebase with config:', firebaseConfig);
    const app = initializeApp(firebaseConfig);
    this.db = getDatabase(app);
    console.log('Database initialized:', this.db);
  }

  // Returns an observable array of categories
  getAll(): Observable<any[]> {
    return new Observable((observer) => {
      const categoriesRef = ref(this.db, 'categories');
      console.log('Fetching categories from reference:', categoriesRef);
      onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val();
        console.log('Raw categories data from Firebase:', data);
        if (data) {
          const categories = Object.keys(data).map(key => ({
            $key: key,
            ...data[key]
          }));
          console.log('Transformed categories:', categories);
          observer.next(categories);
        } else {
          console.log('No categories found in Firebase, emitting empty array');
          observer.next([]);
        }
      }, (error) => {
        console.error('Error fetching categories:', error);
        observer.error(error);
      });
    });
  }

  // Returns a sorted observable array by name
  getCategories(): Observable<any[]> {
    return this.getAll().pipe(
      map(categories => {
        console.log('Categories before sorting:', categories);
        const sortedCategories = categories.sort((a, b) => a.name.localeCompare(b.name));
        console.log('Categories after sorting:', sortedCategories);
        return sortedCategories;
      })
    );
  }
}
