export interface Product {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: 'Brownies' | 'Premium';
  badge?: string;
  rating?: number;
  ratingCount?: number;
  sizes?: string[];
  toppings?: string[];
  recipeId?: string; // Linked recipe ID for HPP calculation
}

export interface CartItem {
  id: string; // unique key: productId + size + topping
  product: Product;
  selectedSize: string;
  selectedTopping?: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 
  | 'Menunggu Pembayaran'
  | 'Menunggu Konfirmasi'
  | 'Pembayaran Ditolak'
  | 'Diproses'
  | 'Dikirim'
  | 'Selesai'
  | 'Dibatalkan';

export interface Order {
  id: string;
  customerName: string;
  phone: string;
  address: string;
  notes?: string;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'BCA' | 'Mandiri' | 'BRI';
  proofUrl?: string;
  resiNumber?: string;
  createdAt: string;
}

export interface Ingredient {
  id: string;
  name: string;
  unit: string;
  qty: number;
  pricePerUnit: number;
}

export interface Recipe {
  id: string;
  name: string;
  image: string;
  ingredients: Ingredient[];
  packagingCost: number;
  utilityCost: number;
  yieldQty: number;
  targetMargin: number; // e.g. 40 for 40%
  lastUpdated: string;
}
