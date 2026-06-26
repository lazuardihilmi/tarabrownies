import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  deleteDoc, 
  updateDoc,
  query,
  orderBy,
  getDoc
} from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Recipe, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS, INITIAL_RECIPES } from '../data';

// Collection references
const PRODUCTS_COL = 'products';
const RECIPES_COL = 'recipes';
const ORDERS_COL = 'orders';

/**
 * Initialize / Seed database if empty
 */
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Products
    const prodSnap = await getDocs(collection(db, PRODUCTS_COL));
    if (prodSnap.empty) {
      console.log('Seeding products to Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COL, prod.id), prod);
      }
    }

    // 2. Seed Recipes
    const recipeSnap = await getDocs(collection(db, RECIPES_COL));
    if (recipeSnap.empty) {
      console.log('Seeding recipes to Firestore...');
      for (const rec of INITIAL_RECIPES) {
        await setDoc(doc(db, RECIPES_COL, rec.id), rec);
      }
    }

    // 3. Seed Mock Orders (Optional, only if empty)
    const orderSnap = await getDocs(collection(db, ORDERS_COL));
    if (orderSnap.empty) {
      console.log('Seeding default orders to Firestore...');
      const defaultOrders: Order[] = [
        {
          id: 'TB-20260623-001',
          customerName: 'Rizky Pratama',
          phone: '08123456789',
          address: 'Kebayoran Baru, Jakarta Selatan',
          notes: 'Minta dipotong jadi 16 bagian ya chef.',
          items: [
            {
              id: 'prod-1-Standard-None',
              product: INITIAL_PRODUCTS[0],
              selectedSize: '20x10 cm',
              selectedTopping: 'Almond Flakes',
              quantity: 1,
              price: 72000
            },
            {
              id: 'prod-3-Standard-None',
              product: INITIAL_PRODUCTS[2],
              selectedSize: '20x10 cm',
              selectedTopping: 'Keju Parut',
              quantity: 1,
              price: 78000
            }
          ],
          subtotal: 150000,
          shippingFee: 0,
          discount: 10000,
          total: 140000,
          paymentMethod: 'BCA',
          status: 'Selesai',
          proofUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtr81YclMNuQ8YXQa7NBg5wL2QvF4JJHCuIfdCfHLte7M2tORq-kqgZ78bDgCGWZkyboMGFLTsTcW4TwvYhmNUwQZZW6ZiaGYiNXvvdAfzgzafnGw0DaW482xQJyTz0yU7sgh8APu9yUa36EUGV5ABVUORgTix6OQKjP9aNaroYJLN1n4eVtILtOwQ31ikpJByKOh97ipox8iWh4rl-st6FccJJEF4Sdiqc5PMSVWyLTJN-1TClhhwP4S5EX8CsK6XnXTAAx52kyI',
          createdAt: '2026-06-23T10:00:00Z'
        },
        {
          id: 'TB-20260623-002',
          customerName: 'Siti Rahmawati',
          phone: '087711223344',
          address: 'Jl. Margonda No. 45, Depok',
          notes: 'Kirim agak sorean ya biar masih anget pas buka puasa.',
          items: [
            {
              id: 'prod-2-Standard-None',
              product: INITIAL_PRODUCTS[1],
              selectedSize: '20x10 cm',
              selectedTopping: 'Choco Chips',
              quantity: 1,
              price: 85000
            }
          ],
          subtotal: 85000,
          shippingFee: 0,
          discount: 10000,
          total: 75000,
          paymentMethod: 'Mandiri',
          status: 'Menunggu Konfirmasi',
          proofUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDtr81YclMNuQ8YXQa7NBg5wL2QvF4JJHCuIfdCfHLte7M2tORq-kqgZ78bDgCGWZkyboMGFLTsTcW4TwvYhmNUwQZZW6ZiaGYiNXvvdAfzgzafnGw0DaW482xQJyTz0yU7sgh8APu9yUa36EUGV5ABVUORgTix6OQKjP9aNaroYJLN1n4eVtILtOwQ31ikpJByKOh97ipox8iWh4rl-st6FccJJEF4Sdiqc5PMSVWyLTJN-1TClhhwP4S5EX8CsK6XnXTAAx52kyI',
          createdAt: '2026-06-23T12:30:00Z'
        }
      ];
      for (const order of defaultOrders) {
        await setDoc(doc(db, ORDERS_COL, order.id), order);
      }
    }
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
}

/**
 * PRODUCTS (Katalog Kue)
 */
export async function getProducts(): Promise<Product[]> {
  try {
    const snap = await getDocs(collection(db, PRODUCTS_COL));
    const items: Product[] = [];
    snap.forEach((doc) => {
      items.push({ ...(doc.data() as Product), id: doc.id });
    });
    return items;
  } catch (err) {
    console.error('Error loading products from Firestore, falling back to data.ts:', err);
    return INITIAL_PRODUCTS;
  }
}

export async function saveProduct(product: Product): Promise<void> {
  await setDoc(doc(db, PRODUCTS_COL, product.id), product);
}

export async function deleteProduct(productId: string): Promise<void> {
  await deleteDoc(doc(db, PRODUCTS_COL, productId));
}

/**
 * RECIPES (Resep HPP)
 */
export async function getRecipes(): Promise<Recipe[]> {
  try {
    const snap = await getDocs(collection(db, RECIPES_COL));
    const items: Recipe[] = [];
    snap.forEach((doc) => {
      items.push({ ...(doc.data() as Recipe), id: doc.id });
    });
    return items;
  } catch (err) {
    console.error('Error loading recipes from Firestore:', err);
    return INITIAL_RECIPES;
  }
}

export async function saveRecipe(recipe: Recipe): Promise<void> {
  await setDoc(doc(db, RECIPES_COL, recipe.id), recipe);
}

export async function deleteRecipe(recipeId: string): Promise<void> {
  await deleteDoc(doc(db, RECIPES_COL, recipeId));
}

/**
 * ORDERS (Pesanan Kue)
 */
export async function getOrders(): Promise<Order[]> {
  try {
    const q = query(collection(db, ORDERS_COL), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    const items: Order[] = [];
    snap.forEach((doc) => {
      items.push({ ...(doc.data() as Order), id: doc.id });
    });
    return items;
  } catch (err) {
    console.error('Error loading orders from Firestore:', err);
    // Try without query ordering (just in case index hasn't built yet)
    try {
      const snap = await getDocs(collection(db, ORDERS_COL));
      const items: Order[] = [];
      snap.forEach((doc) => {
        items.push({ ...(doc.data() as Order), id: doc.id });
      });
      return items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (innerErr) {
      console.error('Fall back error:', innerErr);
      return [];
    }
  }
}

export async function saveOrder(order: Order): Promise<void> {
  await setDoc(doc(db, ORDERS_COL, order.id), order);
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<void> {
  const docRef = doc(db, ORDERS_COL, orderId);
  await updateDoc(docRef, { status });
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  try {
    const docRef = doc(db, ORDERS_COL, orderId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Order;
    }
    return null;
  } catch (err) {
    console.error('Error getting order by id:', err);
    return null;
  }
}
