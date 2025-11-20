export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  offerPrice?: number; // Nuevo campo opcional para ofertas
  category: string;
  imageUrl: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum ProductCategory {
  FIGURES = 'Figuras',
  PARTS = 'Repuestos',
  DECOR = 'Decoración',
  ACCESSORIES = 'Accesorios'
}