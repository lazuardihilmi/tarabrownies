import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CatalogView from './components/CatalogView';
import ProductDetailModal from './components/ProductDetailModal';
import CartView from './components/CartView';
import CheckoutView from './components/CheckoutView';
import PaymentView from './components/PaymentView';
import AdminLogin from './components/AdminLogin';
import AdminView from './components/AdminView';
import OrderTrackingModal from './components/OrderTrackingModal';
import { INITIAL_PRODUCTS } from './data';
import { Product, CartItem, Order, OrderStatus } from './types';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { 
  seedDatabaseIfEmpty, 
  getProducts, 
  saveProduct, 
  deleteProduct, 
  getOrders, 
  saveOrder, 
  updateOrderStatus 
} from './db/firebaseService';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>(() => {
    const local = localStorage.getItem('cart');
    return local ? JSON.parse(local) : [];
  });
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [checkoutDiscount, setCheckoutDiscount] = useState<number>(10000);
  const [checkoutPromo, setCheckoutPromo] = useState<string>('');
  
  // Historical and live Orders
  const [orders, setOrders] = useState<Order[]>([]);

  const [activeOrderForPayment, setActiveOrderForPayment] = useState<Order | null>(null);
  const [isLocalAdmin, setIsLocalAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('isLocalAdmin') === 'true';
  });
  const [isFirebaseAdmin, setIsFirebaseAdmin] = useState<boolean>(false);
  const [isTrackingOpen, setIsTrackingOpen] = useState<boolean>(false);
  const [dbLoading, setDbLoading] = useState<boolean>(true);

  // Monitor Firebase Auth state change
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsFirebaseAdmin(!!user);
    });
    return () => unsubscribe();
  }, []);

  const isAdminLoggedIn = isFirebaseAdmin || isLocalAdmin;

  // Simple router supporting hashes, search params, and pathnames for hidden admin login access
  useEffect(() => {
    const handleLocationChange = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.toLowerCase();
      const params = new URLSearchParams(window.location.search);
      
      const hasAdminHash = [
        '#/baker-login', '#baker-login',
        '#/admin-portal', '#admin-portal',
        '#/admin', '#admin'
      ].includes(hash);

      const hasAdminParam = (
        params.get('view') === 'admin' ||
        params.get('view') === 'admin-portal' ||
        params.get('page') === 'admin' ||
        params.get('admin') === 'true'
      );

      const hasAdminPath = [
        '/baker-login',
        '/admin-portal',
        '/admin'
      ].includes(path);

      if (hasAdminHash || hasAdminParam || hasAdminPath) {
        setCurrentView('admin-login');
      }
    };

    // Run on initial load
    handleLocationChange();

    // Listen to route/hash changes
    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  // Fetch Firestore Data on Mount
  useEffect(() => {
    async function loadData() {
      setDbLoading(true);
      try {
        // Seed first
        await seedDatabaseIfEmpty();
        
        const prods = await getProducts();
        setProducts(prods);

        const ords = await getOrders();
        setOrders(ords);
      } catch (err) {
        console.error('Error loading Firestore data on startup:', err);
      } finally {
        setDbLoading(false);
      }
    }
    loadData();
  }, []);

  // Sync cart only to local storage (Cart is transient/local)
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Cart operations
  const handleAddToCart = (newItem: CartItem) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex((item) => item.id === newItem.id);
      if (existingIdx > -1) {
        const copy = [...prev];
        copy[existingIdx].quantity += newItem.quantity;
        return copy;
      }
      return [...prev, newItem];
    });
    alert(`Sukses menambahkan ${newItem.quantity}x ${newItem.product.name} ke keranjang!`);
  };

  const handleUpdateQty = (itemId: string, newQty: number) => {
    setCart((prev) => 
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  // Instant add from catalog view
  const handleInstantAddToCart = (product: Product) => {
    const defaultItem: CartItem = {
      id: `${product.id}-20x10 cm-None`,
      product,
      selectedSize: '20x10 cm',
      selectedTopping: 'None',
      quantity: 1,
      price: product.price
    };
    handleAddToCart(defaultItem);
  };

  // Checkout and promo transitions
  const handleCheckoutTransition = (discount: number, promo: string) => {
    setCheckoutDiscount(discount);
    setCheckoutPromo(promo);
    setCurrentView('checkout');
  };

  const handleCreateOrder = async (formData: {
    name: string;
    phone: string;
    address: string;
    notes?: string;
    paymentMethod: 'BCA' | 'Mandiri' | 'BRI';
  }) => {
    const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const finalTotal = Math.max(0, subtotal - checkoutDiscount);
    const orderId = `TB-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: orderId,
      customerName: formData.name,
      phone: formData.phone,
      address: formData.address,
      notes: formData.notes,
      items: [...cart],
      subtotal,
      shippingFee: 0,
      discount: checkoutDiscount,
      total: finalTotal,
      paymentMethod: formData.paymentMethod,
      status: 'Menunggu Pembayaran',
      createdAt: new Date().toISOString()
    };

    try {
      await saveOrder(newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      setActiveOrderForPayment(newOrder);
      setCart([]); // Clear cart
      setCurrentView('payment');
    } catch (err) {
      console.error('Failed to save order to Firestore:', err);
      alert('Gagal mengirimkan pesanan ke database Cloud Firestore. Silakan coba kembali.');
    }
  };

  // Confirm upload and change status
  const handleConfirmPaymentProof = async (orderId: string, proofUrl: string) => {
    try {
      const targetOrder = orders.find((o) => o.id === orderId);
      if (targetOrder) {
        const updatedOrder: Order = {
          ...targetOrder,
          status: 'Menunggu Konfirmasi',
          proofUrl
        };
        await saveOrder(updatedOrder);

        setOrders((prev) => 
          prev.map((ord) => (ord.id === orderId ? updatedOrder : ord))
        );

        // Update active view order reference
        if (activeOrderForPayment && activeOrderForPayment.id === orderId) {
          setActiveOrderForPayment(updatedOrder);
        }

        alert('Terima kasih! Bukti transfer berhasil diunggah. Kami akan memverifikasi pembayaran Anda dalam maksimal 15 menit.');
      }
    } catch (err) {
      console.error('Failed to confirm payment proof:', err);
      alert('Gagal memperbarui bukti pembayaran di Firestore.');
    }
  };

  // Admin state controls
  const handleUpdateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      setOrders((prev) => 
        prev.map((ord) => (ord.id === orderId ? { ...ord, status: newStatus } : ord))
      );
    } catch (err) {
      console.error('Failed to update status in Firestore:', err);
      alert('Gagal memperbarui status pesanan di database.');
    }
  };

  // Product changes sync
  const handleUpdateProducts = async (updatedProducts: Product[]) => {
    const previousProducts = [...products];
    setProducts(updatedProducts);

    try {
      // Find deleted products
      const currentIds = new Set(updatedProducts.map(p => p.id));
      const deletedIds = previousProducts.filter(p => !currentIds.has(p.id)).map(p => p.id);

      for (const id of deletedIds) {
        await deleteProduct(id);
      }

      // Upsert updated/new products
      for (const prod of updatedProducts) {
        await saveProduct(prod);
      }
    } catch (err) {
      console.error('Failed to sync product list changes to Firestore:', err);
      alert('Gagal menyimpan perubahan menu produk ke database Cloud.');
    }
  };

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="flex flex-col min-h-screen bg-surface font-sans text-on-surface">
      
      {/* Universal navigation head bar (Except when full screen admin is loaded) */}
      {currentView !== 'admin-dashboard' && (
        <Navbar 
          currentView={currentView} 
          onNavigate={(view) => {
            if (view === 'admin-login' && isAdminLoggedIn) {
              setCurrentView('admin-dashboard');
            } else {
              setCurrentView(view);
            }
          }} 
          cartCount={cartCount} 
          isAdminLoggedIn={isAdminLoggedIn}
        />
      )}

      {/* Primary viewport switch container */}
      <div className="flex-grow max-w-container-max w-full mx-auto px-gutter-mobile md:px-gutter-desktop py-6">
        {currentView === 'home' && (
          <CatalogView 
            products={products}
            onSelectProduct={(p) => setSelectedProduct(p)}
            onInstantAddToCart={handleInstantAddToCart}
            onNavigate={(v) => setCurrentView(v)}
            onOpenTracking={() => setIsTrackingOpen(true)}
          />
        )}

        {currentView === 'cart' && (
          <CartView 
            cartItems={cart}
            onUpdateQty={handleUpdateQty}
            onRemoveItem={handleRemoveItem}
            onNavigate={(v) => setCurrentView(v)}
            onCheckout={handleCheckoutTransition}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView 
            cartItems={cart}
            discountAmount={checkoutDiscount}
            onNavigate={(v) => setCurrentView(v)}
            onSubmitOrder={handleCreateOrder}
          />
        )}

        {currentView === 'payment' && activeOrderForPayment && (
          <PaymentView 
            order={activeOrderForPayment}
            onConfirmPayment={handleConfirmPaymentProof}
            onNavigate={(v) => setCurrentView(v)}
          />
        )}

        {currentView === 'admin-login' && (
          <AdminLogin 
            onLoginSuccess={(isLocalFallback) => {
              if (isLocalFallback) {
                setIsLocalAdmin(true);
                sessionStorage.setItem('isLocalAdmin', 'true');
              }
              setCurrentView('admin-dashboard');
            }}
            onCancel={() => setCurrentView('home')}
          />
        )}

        {currentView === 'admin-dashboard' && (
          <AdminView 
            orders={orders}
            onUpdateOrderStatus={handleUpdateOrderStatus}
            products={products}
            onUpdateProducts={handleUpdateProducts}
            onLogout={async () => {
              try {
                await signOut(auth);
              } catch (err) {
                console.error('Failed to sign out from Firebase Auth:', err);
              }
              setIsLocalAdmin(false);
              sessionStorage.removeItem('isLocalAdmin');
              setCurrentView('home');
            }}
          />
        )}
      </div>

      {/* Universal Footer */}
      {currentView !== 'admin-dashboard' && (
        <Footer onNavigate={(view) => setCurrentView(view)} />
      )}

      {/* Overlays / Modals */}
      {selectedProduct && (
        <ProductDetailModal 
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}

      {isTrackingOpen && (
        <OrderTrackingModal 
          onClose={() => setIsTrackingOpen(false)}
          orders={orders}
          onSelectOrderToPay={(ord) => {
            setActiveOrderForPayment(ord);
            setCurrentView('payment');
          }}
        />
      )}

    </div>
  );
}
