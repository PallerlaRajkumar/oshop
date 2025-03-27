// product.ts
export interface Product {
    $key?: string;   // assigned by Realtime Database if using { keyField: '$key' }
    title?: string;
    price?: number;
    category?: string;
    imageUrl?: string;
  }
  