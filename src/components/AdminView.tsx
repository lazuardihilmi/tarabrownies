import React, { useState, useEffect } from 'react';
import { 
  ListOrdered, Calculator, Plus, Trash2, Search, Edit2, Copy, Save, 
  X, Image, CheckCircle, HelpCircle, PhoneCall, ShoppingBag, Link as LinkIcon
} from 'lucide-react';
import { Order, Recipe, Ingredient, OrderStatus, Product } from '../types';
import { INITIAL_RECIPES } from '../data';
import { getRecipes, saveRecipe } from '../db/firebaseService';

interface AdminViewProps {
  orders: Order[];
  onUpdateOrderStatus: (orderId: string, status: OrderStatus) => void;
  products: Product[];
  onUpdateProducts: (products: Product[]) => void;
  onLogout: () => void;
}

export default function AdminView({ 
  orders, 
  onUpdateOrderStatus, 
  products, 
  onUpdateProducts, 
  onLogout 
}: AdminViewProps) {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calculator' | 'menu'>('dashboard');
  
  // Recipe states
  const [recipes, setRecipes] = useState<Recipe[]>(INITIAL_RECIPES);
  const [recipesLoading, setRecipesLoading] = useState<boolean>(true);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [recipeName, setRecipeName] = useState('Signature Fudgy Box');
  const [recipeImage, setRecipeImage] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuAl8ko9TQaaVYJTnYUPYZpXbIiIfD2BpeRktr-QrA-3hs8cw04oiloDiydYdtL6mdLkky4XNLCoYzjwnGpTMOx9rK7y7xKVvS4gr6pthUUGqPlSC0ntmtTddLT1yWAMi6Izllw4BrOpReOPH5RmquMhN9UNJmrDp-E7fPI2TbYo0SYnscACKYbEOrAr4y5v7wDvbUL0TjVcB0auxRmP06jWROJyKpp7vo1lC4bKb2TvBuTCDUPzH6GcOs2OrxODvcUZ4NRlGAES6BQ');
  
  // Menu/Product Editor states
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [prodName, setProdName] = useState('');
  const [prodCategory, setProdCategory] = useState<'Brownies' | 'Premium'>('Brownies');
  const [prodDescription, setProdDescription] = useState('');
  const [prodLongDescription, setProdLongDescription] = useState('');
  const [prodPrice, setProdPrice] = useState<number>(75000);
  const [prodOriginalPrice, setProdOriginalPrice] = useState<number>(0);
  const [prodImage, setProdImage] = useState('');
  const [prodLinkedRecipeId, setProdLinkedRecipeId] = useState<string>('');
  const [prodBadge, setProdBadge] = useState('');
  
  // Dynamic raw ingredients for calculator
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { id: '1', name: 'Cokelat Couverture', unit: 'gram', qty: 200, pricePerUnit: 150 },
    { id: '2', name: 'Butter Wijsman', unit: 'gram', qty: 150, pricePerUnit: 450 },
    { id: '3', name: 'Gula Kastor', unit: 'gram', qty: 180, pricePerUnit: 35 }
  ]);

  // Overheads and margin values
  const [packagingCost, setPackagingCost] = useState<number>(4500);
  const [utilityCost, setUtilityCost] = useState<number>(2000);
  const [yieldQty, setYieldQty] = useState<number>(1);
  const [targetMargin, setTargetMargin] = useState<number>(40); // 40%

  // Search recipes & products
  const [searchQuery, setSearchQuery] = useState('');
  const [searchProductQuery, setSearchProductQuery] = useState('');

  // Selected payment verification proof modal state
  const [activeProofUrl, setActiveProofUrl] = useState<string | null>(null);

  // Load recipes on mount
  useEffect(() => {
    async function loadRecipes() {
      setRecipesLoading(true);
      try {
        const rList = await getRecipes();
        setRecipes(rList);
      } catch (err) {
        console.error('Error fetching recipes:', err);
      } finally {
        setRecipesLoading(false);
      }
    }
    loadRecipes();
  }, []);

  // Calculate dynamic outputs
  const totalMaterialCost = ingredients.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);
  const totalOverheadCost = packagingCost + utilityCost;
  const hppPerUnit = (totalMaterialCost + totalOverheadCost) / Math.max(1, yieldQty);
  const suggestedSellingPrice = hppPerUnit / (1 - targetMargin / 100);

  // Load recipe into editor
  const handleLoadRecipe = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
    setRecipeName(recipe.name);
    setRecipeImage(recipe.image);
    setIngredients(recipe.ingredients);
    setPackagingCost(recipe.packagingCost);
    setUtilityCost(recipe.utilityCost);
    setYieldQty(recipe.yieldQty);
    setTargetMargin(recipe.targetMargin);
    setActiveTab('calculator');
  };

  // Duplicate recipe item
  const handleDuplicateRecipe = async (recipe: Recipe) => {
    const newRecipe: Recipe = {
      ...recipe,
      id: `recipe-${Date.now()}`,
      name: `${recipe.name} (Salinan)`,
      lastUpdated: 'Baru saja'
    };
    try {
      await saveRecipe(newRecipe);
      setRecipes((prev) => [...prev, newRecipe]);
      alert('Resep berhasil disalin.');
    } catch (err) {
      console.error('Error copying recipe:', err);
      alert('Gagal menyalin resep ke database.');
    }
  };

  // Add ingredient row
  const handleAddIngredientRow = () => {
    const newId = `ing-${Date.now()}`;
    setIngredients([
      ...ingredients,
      { id: newId, name: 'Bahan Baru', unit: 'gram', qty: 100, pricePerUnit: 100 }
    ]);
  };

  // Remove ingredient row
  const handleRemoveIngredientRow = (id: string) => {
    if (ingredients.length <= 1) {
      alert('Sisa setidaknya satu baris bahan baku.');
      return;
    }
    setIngredients(ingredients.filter(i => i.id !== id));
  };

  // Handle edit ingredient inputs
  const handleUpdateIngredient = (id: string, field: keyof Ingredient, value: string | number) => {
    setIngredients(
      ingredients.map(item => {
        if (item.id === id) {
          return { ...item, [field]: value };
        }
        return item;
      })
    );
  };

  // Save Recipe
  const handleSaveRecipe = async () => {
    if (!recipeName.trim()) {
      alert('Nama resep tidak boleh kosong.');
      return;
    }

    if (selectedRecipeId) {
      // Edit existing
      const updatedRecipe: Recipe = {
        id: selectedRecipeId,
        name: recipeName,
        image: recipeImage,
        ingredients,
        packagingCost,
        utilityCost,
        yieldQty,
        targetMargin,
        lastUpdated: 'Baru saja diperbarui'
      };

      try {
        await saveRecipe(updatedRecipe);
        setRecipes((prev) => 
          prev.map((r) => (r.id === selectedRecipeId ? updatedRecipe : r))
        );
        alert('Resep berhasil diperbarui.');
      } catch (err) {
        console.error('Failed to update recipe:', err);
        alert('Gagal memperbarui resep di database.');
      }
    } else {
      // Create new
      const newRecipe: Recipe = {
        id: `recipe-${Date.now()}`,
        name: recipeName,
        image: recipeImage,
        ingredients,
        packagingCost,
        utilityCost,
        yieldQty,
        targetMargin,
        lastUpdated: 'Baru saja disimpan'
      };

      try {
        await saveRecipe(newRecipe);
        setRecipes((prev) => [...prev, newRecipe]);
        setSelectedRecipeId(newRecipe.id);
        alert('Resep baru berhasil disimpan.');
      } catch (err) {
        console.error('Failed to save recipe:', err);
        alert('Gagal menyimpan resep baru ke database.');
      }
    }
  };

  // Product CRUD Handlers
  const handleNewProductForm = () => {
    setEditingProductId(null);
    setProdName('Produk Baru');
    setProdCategory('Brownies');
    setProdDescription('Deskripsi singkat lezatnya brownies panggang kami.');
    setProdLongDescription('Setiap gigitan dipanggang segar dengan cinta menggunakan bahan baku premium pilihan dapur TaraBrownies.');
    setProdPrice(75000);
    setProdOriginalPrice(85000);
    setProdImage('https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM');
    setProdLinkedRecipeId('');
    setProdBadge('NEW');
  };

  const handleLoadProduct = (product: Product) => {
    setEditingProductId(product.id);
    setProdName(product.name);
    setProdCategory(product.category);
    setProdDescription(product.description);
    setProdLongDescription(product.longDescription || '');
    setProdPrice(product.price);
    setProdOriginalPrice(product.originalPrice || 0);
    setProdImage(product.image);
    setProdLinkedRecipeId(product.recipeId || '');
    setProdBadge(product.badge || '');
  };

  const handleSaveProduct = () => {
    if (!prodName.trim()) {
      alert('Nama produk tidak boleh kosong.');
      return;
    }
    if (prodPrice <= 0) {
      alert('Harga jual produk harus lebih besar dari 0.');
      return;
    }

    if (editingProductId) {
      // Edit mode
      const updatedProducts = products.map((p) => {
        if (p.id === editingProductId) {
          return {
            ...p,
            name: prodName,
            category: prodCategory,
            description: prodDescription,
            longDescription: prodLongDescription,
            price: prodPrice,
            originalPrice: prodOriginalPrice > 0 ? prodOriginalPrice : undefined,
            image: prodImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM',
            recipeId: prodLinkedRecipeId || undefined,
            badge: prodBadge || undefined
          };
        }
        return p;
      });
      onUpdateProducts(updatedProducts);
      alert('Produk menu berhasil diperbarui.');
    } else {
      // Add mode
      const newProduct: Product = {
        id: `prod-${Date.now()}`,
        name: prodName,
        category: prodCategory,
        description: prodDescription,
        longDescription: prodLongDescription,
        price: prodPrice,
        originalPrice: prodOriginalPrice > 0 ? prodOriginalPrice : undefined,
        image: prodImage || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM',
        recipeId: prodLinkedRecipeId || undefined,
        badge: prodBadge || undefined,
        rating: 5.0,
        ratingCount: 1,
        sizes: ['20x10 cm', '20x20 cm'],
        toppings: ['Almond', 'Cheese', 'Chocochips']
      };
      onUpdateProducts([newProduct, ...products]);
      setEditingProductId(newProduct.id);
      alert('Produk menu baru berhasil ditambahkan.');
    }
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk menu ini? Produk tidak akan lagi muncul di katalog pembeli.')) {
      onUpdateProducts(products.filter((p) => p.id !== productId));
      if (editingProductId === productId) {
        setEditingProductId(null);
      }
    }
  };

  // Clear calculator to make new
  const handleNewRecipeForm = () => {
    setSelectedRecipeId(null);
    setRecipeName('Resep Baru');
    setRecipeImage('https://lh3.googleusercontent.com/aida-public/AB6AXuCcw1YtMXVrytm9b_-8bIOrCKSOUfQ9AKyVRhebftU1r-1ja35B8NgwmcIxesT7sMBalc_L6xGyYPtlWPYlqY2pb9pAhSn1wZm3FqcYEWaDaVl4toRAsvTBahgYDqOXN2kKuzNKOqUlZ4nJqDdyYeq9rUgtKB2Wl9ZRvf_aSqclvmEZkXqvVM3dKkRs5bA_czAe2wd44HCrd3JUbR6gxkacWArwCjYnvknc8lNdC15qY9NN0Isay2XRHNuz8iAbelzyiVdBiECVGmA');
    setIngredients([
      { id: '1', name: 'Tepung Terigu', unit: 'gram', qty: 100, pricePerUnit: 20 }
    ]);
    setPackagingCost(4500);
    setUtilityCost(2000);
    setYieldQty(1);
    setTargetMargin(40);
  };

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'Menunggu Konfirmasi' || o.status === 'Menunggu Pembayaran').length;
  const activeMenus = 4;
  const totalRevenue = orders
    .filter(o => o.status !== 'Pembayaran Ditolak' && o.status !== 'Dibatalkan')
    .reduce((sum, o) => sum + o.total, 0);

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      
      {/* Desktop Dashboard Sidebar */}
      <aside className="hidden md:flex flex-col h-screen sticky top-0 bg-surface-container w-64 border-r border-border-line py-6 shrink-0 z-10">
        <div className="px-6 mb-6">
          <h1 className="font-display text-2xl text-secondary">TaraBrownies</h1>
          <p className="text-on-surface-variant text-xs mt-0.5">Admin Dashboard</p>
        </div>

        <nav className="flex-grow space-y-2 px-3">
          <button 
            type="button"
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'dashboard' 
                ? 'bg-secondary text-white shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <ListOrdered className="w-5 h-5" />
            <span>Order Manager</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('calculator')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'calculator' 
                ? 'bg-secondary text-white shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>HPP Calculator</span>
          </button>

          <button 
            type="button"
            onClick={() => setActiveTab('menu')}
            className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all ${
              activeTab === 'menu' 
                ? 'bg-secondary text-white shadow-sm' 
                : 'text-on-surface-variant hover:bg-surface-container-highest'
            }`}
          >
            <ShoppingBag className="w-5 h-5" />
            <span>Manajemen Menu</span>
          </button>
        </nav>

        <div className="mt-auto px-4 pt-4 border-t border-border-line">
          <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
            <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">
              TA
            </div>
            <div className="flex-grow min-w-0">
              <p className="font-bold text-xs text-primary truncate">Tara Admin</p>
              <p className="text-[10px] text-on-surface-variant">Head Baker Chef</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onLogout}
            className="w-full mt-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs transition-colors border border-red-200"
          >
            Logout Portal
          </button>
        </div>
      </aside>

      {/* Mobile Top Tabs Toggle */}
      <div className="md:hidden flex justify-around border-b border-border-line bg-white sticky top-16 z-30 py-1.5 shadow-sm w-full">
        <button 
          type="button"
          onClick={() => setActiveTab('dashboard')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
            activeTab === 'dashboard' ? 'bg-secondary text-white' : 'text-on-surface-variant'
          }`}
        >
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Pesanan</span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('calculator')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
            activeTab === 'calculator' ? 'bg-secondary text-white' : 'text-on-surface-variant'
          }`}
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>HPP</span>
        </button>
        <button 
          type="button"
          onClick={() => setActiveTab('menu')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all ${
            activeTab === 'menu' ? 'bg-secondary text-white' : 'text-on-surface-variant'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Menu</span>
        </button>
        <button 
          type="button"
          onClick={onLogout}
          className="text-red-600 px-3 py-1.5 text-[11px] font-bold"
        >
          Keluar
        </button>
      </div>

      {/* Main Content Canvas */}
      <main className="flex-grow p-6 space-y-8 w-full max-w-container-max mx-auto">
        
        {/* TAB 1: ORDER MANAGER & STATS DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <header>
              <h2 className="font-display text-2xl md:text-3xl text-primary leading-tight">Ringkasan Operasional</h2>
              <p className="text-on-surface-variant text-sm">Update harian untuk dapur TaraBrownies hari ini.</p>
            </header>

            {/* Stats Summary Grid Widgets */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-3xl p-5 border border-border-line shadow-sm space-y-1 relative overflow-hidden">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Total Pesanan</span>
                <span className="font-display text-3xl text-primary block">{totalOrders}</span>
                <div className="absolute right-3 bottom-3 text-4xl opacity-10">🛍️</div>
              </div>

              <div className="bg-surface-container-low rounded-3xl p-5 border border-border-line shadow-sm space-y-1 relative overflow-hidden">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">MENUNGGU</span>
                <span className="font-display text-3xl text-orange-600 block">{pendingOrders}</span>
                <div className="absolute right-3 bottom-3 text-4xl opacity-10">⏳</div>
              </div>

              <div className="bg-white rounded-3xl p-5 border border-border-line shadow-sm space-y-1 relative overflow-hidden">
                <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Menu Aktif</span>
                <span className="font-display text-3xl text-primary block">{activeMenus}</span>
                <div className="absolute right-3 bottom-3 text-4xl opacity-10">🍫</div>
              </div>

              <div className="bg-teal-50 rounded-3xl p-5 border border-teal-200 shadow-sm space-y-1 relative overflow-hidden">
                <span className="text-xs font-bold text-teal-800 uppercase tracking-wider block">Omzet Demo</span>
                <span className="font-display text-2xl text-teal-900 block">Rp {totalRevenue.toLocaleString('id-ID')}</span>
                <div className="absolute right-3 bottom-3 text-4xl opacity-10">💵</div>
              </div>
            </div>

            {/* List of active orders in database */}
            <div className="bg-white rounded-[26px] border border-border-line overflow-hidden shadow-sm">
              <div className="p-5 border-b border-border-line bg-surface-container-low flex justify-between items-center">
                <h3 className="font-display text-lg text-primary">Pesanan Terbaru</h3>
                <span className="text-xs text-on-surface-variant">Update Otomatis</span>
              </div>

              {orders.length === 0 ? (
                <p className="p-8 text-center text-sm text-on-surface-variant italic">Belum ada transaksi pemesanan masuk.</p>
              ) : (
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-surface-container border-b border-border-line font-bold">
                        <th className="px-5 py-3">ID PESANAN</th>
                        <th className="px-5 py-3">PELANGGAN</th>
                        <th className="px-5 py-3">PRODUK</th>
                        <th className="px-5 py-3 text-right">TOTAL</th>
                        <th className="px-5 py-3 text-center">STATUS</th>
                        <th className="px-5 py-3 text-center">AKSI VERIFIKASI</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-line">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-surface-container-low transition-colors">
                          <td className="px-5 py-4 font-mono font-bold text-xs">{o.id}</td>
                          <td className="px-5 py-4">
                            <div className="font-bold">{o.customerName}</div>
                            <div className="text-[11px] text-on-surface-variant font-mono">{o.phone}</div>
                          </td>
                          <td className="px-5 py-4">
                            <div className="max-w-[200px] truncate font-bold text-xs">
                              {o.items.map(it => `${it.product.name} (${it.quantity}x)`).join(', ')}
                            </div>
                            <div className="text-[11px] text-on-surface-variant truncate">
                              {o.address}
                            </div>
                          </td>
                          <td className="px-5 py-4 text-right font-bold text-secondary">
                            Rp {o.total.toLocaleString('id-ID')}
                          </td>
                          <td className="px-5 py-4 text-center">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              o.status === 'Selesai' ? 'bg-green-100 text-green-800' :
                              o.status === 'Dikirim' ? 'bg-blue-100 text-blue-800' :
                              o.status === 'Diproses' ? 'bg-yellow-100 text-yellow-800' :
                              o.status === 'Menunggu Konfirmasi' ? 'bg-orange-100 text-orange-800 font-extrabold animate-pulse' :
                              o.status === 'Pembayaran Ditolak' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <div className="flex flex-wrap items-center justify-center gap-1.5">
                              {/* View payment proof thumbnail button */}
                              {o.proofUrl ? (
                                <button
                                  type="button"
                                  onClick={() => setActiveProofUrl(o.proofUrl || null)}
                                  className="px-2.5 py-1 bg-surface-container hover:bg-surface-container-high rounded-md text-[10px] font-bold text-secondary border border-border-line flex items-center gap-1"
                                >
                                  <Image className="w-3 h-3" />
                                  <span>Bukti</span>
                                </button>
                              ) : (
                                <span className="text-[10px] text-on-surface-variant/50 italic">No proof</span>
                              )}

                              {/* State changes actions */}
                              {o.status === 'Menunggu Konfirmasi' && (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(o.id, 'Diproses')}
                                    className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] rounded"
                                  >
                                    Terima
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => onUpdateOrderStatus(o.id, 'Pembayaran Ditolak')}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white font-bold text-[10px] rounded"
                                  >
                                    Tolak
                                  </button>
                                </>
                              )}

                              {o.status === 'Diproses' && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    const resi = prompt('Masukkan Nomor Resi Pengiriman:', `RESI-${Date.now().toString().slice(-6)}`);
                                    if (resi) {
                                      onUpdateOrderStatus(o.id, 'Dikirim');
                                    }
                                  }}
                                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] rounded"
                                >
                                  Kirim Kue
                                </button>
                              )}

                              {o.status === 'Dikirim' && (
                                <button
                                  type="button"
                                  onClick={() => onUpdateOrderStatus(o.id, 'Selesai')}
                                  className="px-2.5 py-1 bg-green-600 hover:bg-green-700 text-white font-bold text-[10px] rounded"
                                >
                                  Selesai
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Raw material ingredients alert warning box */}
            <section className="bg-primary text-on-primary p-6 rounded-[26px] shadow-sm relative overflow-hidden">
              <h4 className="font-display text-lg text-butter-yellow mb-2">Kualitas Bahan Baku Dapur</h4>
              <p className="text-xs opacity-85 leading-relaxed max-w-xl">
                Stok Cokelat Couverture Premium tersisa 15% dari ambang batas aman. Segera lakukan restock ke supplier langganan agar kualitas rasa brownies tetap terjaga dengan prima.
              </p>
              <button 
                type="button"
                onClick={() => alert('Kontak supplier WhatsApp: +62811223344')}
                className="mt-4 px-5 py-2.5 bg-butter-yellow text-primary rounded-xl font-bold text-xs"
              >
                Restock Sekarang
              </button>
            </section>
          </div>
        )}

        {/* TAB 2: HPP & PRICING RECIPE CALCULATOR */}
        {activeTab === 'calculator' && (
          <div className="space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-primary leading-tight">HPP &amp; Pricing Calculator</h2>
                <p className="text-on-surface-variant text-sm">Kelola biaya bahan baku dan tentukan harga jual produk secara akurat.</p>
              </div>

              <button
                type="button"
                onClick={handleNewRecipeForm}
                className="bg-secondary text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1 hover:brightness-110 active:scale-95 shadow-sm self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Buat Resep Baru</span>
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Editor Ingredients inputs */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Ingredients card table row */}
                <section className="bg-white p-6 rounded-[26px] border border-border-line space-y-4 shadow-sm">
                  <div className="flex items-center justify-between pb-2 border-b border-border-line">
                    <h3 className="font-display text-md text-primary flex items-center gap-2">
                      <span>🍳</span>
                      Bahan Baku Kue
                    </h3>
                    
                    <button 
                      type="button"
                      onClick={handleAddIngredientRow}
                      className="text-secondary flex items-center gap-1 font-bold text-xs hover:underline"
                    >
                      <Plus className="w-3.5 h-3.5" /> Tambah Bahan
                    </button>
                  </div>

                  <div className="space-y-3">
                    {ingredients.map((ing) => (
                      <div key={ing.id} className="grid grid-cols-12 gap-2 md:gap-3 items-end pb-2 border-b border-border-line last:border-0">
                        
                        <div className="col-span-4 md:col-span-5">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Nama Bahan</label>
                          <input 
                            type="text"
                            value={ing.name}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'name', e.target.value)}
                            className="w-full rounded-full border border-outline-variant px-3 py-2 bg-transparent text-xs"
                            placeholder="Cokelat Couverture"
                          />
                        </div>

                        <div className="col-span-3 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Satuan</label>
                          <select
                            value={ing.unit}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'unit', e.target.value)}
                            className="w-full rounded-full border border-outline-variant px-2 py-2 bg-white text-xs outline-none"
                          >
                            <option value="gram">gram</option>
                            <option value="ml">ml</option>
                            <option value="pcs">pcs</option>
                          </select>
                        </div>

                        <div className="col-span-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Qty</label>
                          <input 
                            type="number"
                            value={ing.qty}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'qty', Number(e.target.value))}
                            className="w-full rounded-full border border-outline-variant px-2 py-2 bg-transparent text-xs"
                            placeholder="200"
                          />
                        </div>

                        <div className="col-span-2 md:col-span-2">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-on-surface-variant block mb-1">Harga/Unit</label>
                          <input 
                            type="number"
                            value={ing.pricePerUnit}
                            onChange={(e) => handleUpdateIngredient(ing.id, 'pricePerUnit', Number(e.target.value))}
                            className="w-full rounded-full border border-outline-variant px-2 py-2 bg-transparent text-xs"
                            placeholder="150"
                          />
                        </div>

                        <div className="col-span-1 flex justify-end">
                          <button 
                            type="button"
                            onClick={() => handleRemoveIngredientRow(ing.id)}
                            className="text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                      </div>
                    ))}
                  </div>
                </section>

                {/* Overheads Costs Block */}
                <section className="bg-white p-6 rounded-[26px] border border-border-line space-y-4 shadow-sm">
                  <h3 className="font-display text-md text-primary flex items-center gap-2">
                    <span>📦</span>
                    Overhead &amp; Packaging
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Packaging (per Box)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-bold">Rp</span>
                          <input 
                            type="number"
                            value={packagingCost}
                            onChange={(e) => setPackagingCost(Number(e.target.value))}
                            className="w-full pl-9 pr-4 py-2 rounded-full border border-outline-variant text-xs outline-none focus:border-secondary bg-transparent"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Gas &amp; Listrik (Estimasi)</label>
                        <div className="relative">
                          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs font-bold">Rp</span>
                          <input 
                            type="number"
                            value={utilityCost}
                            onChange={(e) => setUtilityCost(Number(e.target.value))}
                            className="w-full pl-9 pr-4 py-2 rounded-full border border-outline-variant text-xs outline-none focus:border-secondary bg-transparent"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Total Unit per Produksi</label>
                        <div className="relative">
                          <input 
                            type="number"
                            value={yieldQty}
                            onChange={(e) => setYieldQty(Math.max(1, Number(e.target.value)))}
                            className="w-full pr-12 pl-4 py-2 rounded-full border border-outline-variant text-xs outline-none focus:border-secondary bg-transparent"
                          />
                          <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-xs">Box</span>
                        </div>
                        <p className="text-[10px] text-on-surface-variant mt-1.5 italic">HPP akan dibagi dengan jumlah unit ini.</p>
                      </div>
                    </div>
                  </div>
                </section>

              </div>

              {/* Right Column: Live dynamic calculation feedback card */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Result output board */}
                <section className="bg-primary text-on-primary p-6 rounded-[26px] shadow-md relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-secondary rounded-full blur-[50px] opacity-25" />
                  
                  <h3 className="font-display text-lg mb-4 border-b border-white/10 pb-2">Hasil Kalkulasi</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center opacity-85">
                      <span>Biaya Bahan Baku</span>
                      <span className="font-bold">Rp {totalMaterialCost.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="flex justify-between items-center opacity-85">
                      <span>Biaya Overhead</span>
                      <span className="font-bold">Rp {totalOverheadCost.toLocaleString('id-ID')}</span>
                    </div>

                    <div className="pt-3 border-t border-white/10 flex justify-between items-end">
                      <div>
                        <p className="text-[10px] opacity-60 uppercase tracking-wider font-bold">Total HPP per Unit</p>
                        <p className="font-display text-2xl text-butter-yellow">Rp {hppPerUnit.toLocaleString('id-ID')}</p>
                      </div>

                      <div className="bg-white/10 px-3 py-1 rounded-full text-xs border border-white/20">
                        Profit: <span className="font-bold">{targetMargin}%</span>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Sell price recommendation section */}
                <section className="bg-white p-6 rounded-[26px] border border-border-line space-y-4 shadow-sm">
                  <h3 className="font-display text-lg text-primary">Saran Harga Jual</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-grow">
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Target Margin Profit (%)</label>
                        <input 
                          type="range"
                          min={10}
                          max={100}
                          step={5}
                          value={targetMargin}
                          onChange={(e) => setTargetMargin(Number(e.target.value))}
                          className="w-full accent-secondary cursor-pointer"
                        />
                      </div>
                      <div className="w-16 bg-surface-container border border-border-line rounded-xl text-center py-2 font-bold text-secondary text-sm">
                        {targetMargin}%
                      </div>
                    </div>

                    <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
                      <p className="text-xs text-emerald-800 font-bold mb-1">Harga Rekomendasi Jual</p>
                      <div className="flex justify-between items-center">
                        <p className="font-display text-xl text-emerald-950">
                          Rp {Math.round(suggestedSellingPrice).toLocaleString('id-ID')}
                        </p>
                        <span className="text-[10px] bg-emerald-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider font-bold">Best Value</span>
                      </div>
                    </div>

                    {/* Recipe general metadata name and image fields */}
                    <div className="space-y-4 pt-2 border-t border-border-line">
                      <div>
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Nama Resep Penyimpanan</label>
                        <input 
                          type="text"
                          value={recipeName}
                          onChange={(e) => setRecipeName(e.target.value)}
                          placeholder="Nama resep"
                          className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-bold text-on-surface-variant block mb-1">Link Gambar Resep (URL)</label>
                        <div className="flex gap-2">
                          <input 
                            type="text"
                            value={recipeImage}
                            onChange={(e) => setRecipeImage(e.target.value)}
                            placeholder="https://example.com/brownie-image.jpg"
                            className="w-full rounded-full border border-outline-variant px-4 py-2 text-[10px] outline-none focus:border-secondary bg-transparent"
                          />
                          <div className="w-10 h-10 rounded-xl overflow-hidden shrink-0 border border-border-line bg-surface-container-low">
                            <img src={recipeImage} alt="Recipe Preview" className="w-full h-full object-cover" />
                          </div>
                        </div>

                        <div className="pt-1">
                          <p className="text-[10px] text-on-surface-variant font-bold mb-1">Preset Gambar Cepat:</p>
                          <div className="flex flex-wrap gap-1">
                            {[
                              { label: 'Classic', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM' },
                              { label: 'Keju Swirl', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGL_FJgGfvnP9363HaWuu7YGNi8j44i-3HXqX5cBzcSVzABtjYim__fYDcrsK6QXuDUC3gbW8cZwKxWSbkPTfjpJMy22qaXW17poKtQ595_tQnXHa_jePDFUoRnt4sSsUMakbrwwxX_Dz-PsPPKdBPgNBxC6lRrEz1VNqf2bHj6_GYRNdztVU4dY9wee3RTPAcS5t6i7GHGpME_tuZtn_ifePF7Eo9_IjewBghxiUUGTRzFYggb2J2TGSoA42oZSDclqtgD37Qikw' },
                              { label: 'Almond', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcw1YtMXVrytm9b_-8bIOrCKSOUfQ9AKyVRhebftU1r-1ja35B8NgwmcIxesT7sMBalc_L6xGyYPtlWPYlqY2pb9pAhSn1wZm3FqcYEWaDaVl4toRAsvTBahgYDqOXN2kKuzNKOqUlZ4nJqDdyYeq9rUgtKB2Wl9ZRvf_aSqclvmEZkXqvVM3dKkRs5bA_czAe2wd44HCrd3JUbR6gxkacWArwCjYnvknc8lNdC15qY9NN0Isay2XRHNuz8iAbelzyiVdBiECVGmA' },
                              { label: 'Choco Bites', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg_fl4k_IzUv7Cmj2K35uzHTegMoiUVncwWUibAKfXgCF6gePTdy9y7FFavQgxvn9Wc0yoJCHZilkYpnErh5u94aDzXUsO1dZA_FQfUeC40hm9Hd6AWjNqPjJqGVMOzRq7hBum-3jQUYzijTthSBU-Mq37LlpqLuB6nPfNeXnVteAxi-Bo265d71FR_mJIGybl0JHJfpog8XGeXa-S4dAiMTVzye_rGXZw52YaPywqpHkPQ7zRYrey1HWBZ8_wDZACjFham4tJbI' }
                            ].map((preset) => (
                              <button
                                key={preset.label}
                                type="button"
                                onClick={() => setRecipeImage(preset.url)}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-border-line transition-all ${
                                  recipeImage === preset.url ? 'bg-secondary text-white border-secondary' : 'bg-surface hover:bg-surface-container-low text-on-surface'
                                }`}
                              >
                                {preset.label}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action save trigger */}
                    <button 
                      type="button"
                      onClick={handleSaveRecipe}
                      className="tactile-button bg-butter-yellow text-primary w-full py-4 rounded-xl font-display text-xs tracking-widest uppercase flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-1"
                    >
                      <Save className="w-4 h-4" />
                      Simpan Resep &amp; HPP
                    </button>
                  </div>
                </section>

              </div>

            </div>

            {/* List Table of Stored Saved Recipes */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-display text-xl text-primary">Daftar Resep Tersimpan</h3>
                
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari resep..."
                    className="pl-9 pr-4 py-2 w-full rounded-full border border-outline-variant text-xs outline-none focus:border-secondary bg-white"
                  />
                </div>
              </div>

              <div className="bg-white rounded-[26px] border border-border-line overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-border-line font-bold text-on-surface-variant uppercase tracking-wider">
                        <th className="px-6 py-3.5">Nama Produk</th>
                        <th className="px-6 py-3.5 text-center">Batch Size</th>
                        <th className="px-6 py-3.5 text-right">Total HPP</th>
                        <th className="px-6 py-3.5 text-right">Harga Jual Saran</th>
                        <th className="px-6 py-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-line">
                      {filteredRecipes.map((r) => {
                        const recMatCost = r.ingredients.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);
                        const recOverheadCost = r.packagingCost + r.utilityCost;
                        const recHpp = (recMatCost + recOverheadCost) / Math.max(1, r.yieldQty);
                        const recPrice = recHpp / (1 - r.targetMargin / 100);

                        return (
                          <tr key={r.id} className="hover:bg-surface-container-low transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-border-line">
                                  <img 
                                    src={r.image} 
                                    alt={r.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div>
                                  <p className="font-bold text-primary">{r.name}</p>
                                  <p className="text-[10px] text-on-surface-variant font-sans">Update: {r.lastUpdated}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-center text-on-surface-variant">
                              {r.yieldQty} Box ({r.ingredients.length} bahan)
                            </td>
                            <td className="px-6 py-4 text-right font-bold text-secondary">
                              Rp {Math.round(recHpp).toLocaleString('id-ID')}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <span className="bg-secondary-container text-on-secondary-container font-bold px-2.5 py-0.5 rounded-full text-[10px]">
                                Rp {Math.round(recPrice).toLocaleString('id-ID')}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-center">
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                  type="button"
                                  onClick={() => handleLoadRecipe(r)}
                                  className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant"
                                  title="Edit Resep"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button 
                                  type="button"
                                  onClick={() => handleDuplicateRecipe(r)}
                                  className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant"
                                  title="Duplikat Resep"
                                >
                                  <Copy className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* TAB 3: MENU & CATALOG MANAGER */}
        {activeTab === 'menu' && (
          <div className="space-y-8 animate-fade-in">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl md:text-3xl text-primary leading-tight">Manajemen Menu &amp; Katalog</h2>
                <p className="text-on-surface-variant text-sm">Kelola produk yang ditampilkan di toko online dan hubungkan dengan resep HPP.</p>
              </div>

              <button
                type="button"
                onClick={handleNewProductForm}
                className="bg-secondary text-white font-bold text-xs px-4 py-2.5 rounded-full flex items-center gap-1 hover:brightness-110 active:scale-95 shadow-sm self-start md:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Produk Baru</span>
              </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* Left Column: Product Form Editor */}
              <div className="lg:col-span-7 bg-white p-6 rounded-[26px] border border-border-line space-y-4 shadow-sm">
                <h3 className="font-display text-md text-primary flex items-center gap-2 pb-2 border-b border-border-line">
                  <span>🛍️</span>
                  {editingProductId ? 'Edit Detail Produk Menu' : 'Buat Produk Menu Baru'}
                </h3>

                <div className="space-y-3.5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Nama Kue / Menu *</label>
                      <input 
                        type="text"
                        value={prodName}
                        onChange={(e) => setProdName(e.target.value)}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                        placeholder="e.g. Classic Fudgy Brownies"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Kategori Menu *</label>
                      <select
                        value={prodCategory}
                        onChange={(e) => setProdCategory(e.target.value as 'Brownies' | 'Premium')}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs bg-white outline-none focus:border-secondary"
                      >
                        <option value="Brownies">Brownies</option>
                        <option value="Premium">Premium</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Harga Jual (Rp) *</label>
                      <input 
                        type="number"
                        value={prodPrice}
                        onChange={(e) => setProdPrice(Number(e.target.value))}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                        placeholder="75000"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Harga Sebelum Diskon (Rp - Opsional)</label>
                      <input 
                        type="number"
                        value={prodOriginalPrice}
                        onChange={(e) => setProdOriginalPrice(Number(e.target.value))}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                        placeholder="e.g. 85000 (biarkan 0 jika tidak ada diskon)"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Hubungkan dengan Resep HPP (Opsional)</label>
                    <select
                      value={prodLinkedRecipeId}
                      onChange={(e) => setProdLinkedRecipeId(e.target.value)}
                      className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs bg-white outline-none focus:border-secondary text-secondary font-bold"
                    >
                      <option value="">-- Pilih Resep Dapur HPP --</option>
                      {recipes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} (HPP: Rp {Math.round(r.ingredients.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0) + r.packagingCost + r.utilityCost).toLocaleString('id-ID')})
                        </option>
                      ))}
                    </select>
                    <p className="text-[10px] text-on-surface-variant mt-1 italic">Menghubungkan resep akan mengaktifkan analisis keuntungan (profit margin) secara akurat.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Badge Promo (Opsional)</label>
                      <input 
                        type="text"
                        value={prodBadge}
                        onChange={(e) => setProdBadge(e.target.value)}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                        placeholder="e.g. BEST SELLER, FAVORITE, NEW"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-on-surface-variant block mb-1">Link Gambar Kue (URL)</label>
                      <input 
                        type="text"
                        value={prodImage}
                        onChange={(e) => setProdImage(e.target.value)}
                        className="w-full rounded-full border border-outline-variant px-4 py-2 text-[10px] outline-none focus:border-secondary bg-transparent"
                        placeholder="https://example.com/brownie.jpg"
                      />
                    </div>
                  </div>

                  {/* Quick presets for Product Image */}
                  <div>
                    <p className="text-[10px] text-on-surface-variant font-bold mb-1">Preset Gambar Kue Cepat:</p>
                    <div className="flex flex-wrap gap-1">
                      {[
                        { label: 'Classic Fudgy', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_A3lGtMpgmxBU9iKHMFL7iJqm-TI_LVh707mieiVlsyTuRJci7uMUCDVmEAt7PQLwPhYosl4H7Q57O_IlaTf-EMnNux3faSy2wR_lN3bRGuIkn2NYYdqAVQSb7k1wTrbiFohPmzLYARKPQZu-7PYQmOCec1oX68CK0C6d7fgcVC6EqEFZvH71jnz-4XpKEKZFxKBtrwiMGAvb9Rl1oljVwlBUNoJrrzKDUglzpl63nnpimrXDsWf9Uvh84M98CqHCQlbi-VDvydM' },
                        { label: 'Keju Swirl', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGL_FJgGfvnP9363HaWuu7YGNi8j44i-3HXqX5cBzcSVzABtjYim__fYDcrsK6QXuDUC3gbW8cZwKxWSbkPTfjpJMy22qaXW17poKtQ595_tQnXHa_jePDFUoRnt4sSsUMakbrwwxX_Dz-PsPPKdBPgNBxC6lRrEz1VNqf2bHj6_GYRNdztVU4dY9wee3RTPAcS5t6i7GHGpME_tuZtn_ifePF7Eo9_IjewBghxiUUGTRzFYggb2J2TGSoA42oZSDclqtgD37Qikw' },
                        { label: 'Almond Bites', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCcw1YtMXVrytm9b_-8bIOrCKSOUfQ9AKyVRhebftU1r-1ja35B8NgwmcIxesT7sMBalc_L6xGyYPtlWPYlqY2pb9pAhSn1wZm3FqcYEWaDaVl4toRAsvTBahgYDqOXN2kKuzNKOqUlZ4nJqDdyYeq9rUgtKB2Wl9ZRvf_aSqclvmEZkXqvVM3dKkRs5bA_czAe2wd44HCrd3JUbR6gxkacWArwCjYnvknc8lNdC15qY9NN0Isay2XRHNuz8iAbelzyiVdBiECVGmA' },
                        { label: 'Double Choco', url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuADg_fl4k_IzUv7Cmj2K35uzHTegMoiUVncwWUibAKfXgCF6gePTdy9y7FFavQgxvn9Wc0yoJCHZilkYpnErh5u94aDzXUsO1dZA_FQfUeC40hm9Hd6AWjNqPjJqGVMOzRq7hBum-3jQUYzijTthSBU-Mq37LlpqLuB6nPfNeXnVteAxi-Bo265d71FR_mJIGybl0JHJfpog8XGeXa-S4dAiMTVzye_rGXZw52YaPywqpHkPQ7zRYrey1HWBZ8_wDZACjFham4tJbI' }
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => setProdImage(preset.url)}
                          className={`text-[9px] font-bold px-2 py-0.5 rounded-full border border-border-line transition-all ${
                            prodImage === preset.url ? 'bg-secondary text-white' : 'bg-surface hover:bg-surface-container-low text-on-surface'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Deskripsi Singkat (Katalog)</label>
                    <input 
                      type="text"
                      value={prodDescription}
                      onChange={(e) => setProdDescription(e.target.value)}
                      className="w-full rounded-full border border-outline-variant px-4 py-2 text-xs outline-none focus:border-secondary bg-transparent"
                      placeholder="e.g. Cokelat premium melimpah dengan kulit garing di atas."
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-on-surface-variant block mb-1">Informasi Detail Produk (Modal)</label>
                    <textarea 
                      value={prodLongDescription}
                      onChange={(e) => setProdLongDescription(e.target.value)}
                      className="w-full rounded-2xl border border-outline-variant px-4 py-2 text-xs h-20 resize-none outline-none focus:border-secondary bg-transparent"
                      placeholder="e.g. Dibuat fresh by order dengan rasa coklat yang padat, moist, dan tidak terlalu manis..."
                    />
                  </div>

                  <div className="pt-2">
                    <button 
                      type="button"
                      onClick={handleSaveProduct}
                      className="tactile-button bg-butter-yellow text-primary w-full py-3.5 rounded-xl font-display text-xs tracking-widest uppercase flex items-center justify-center gap-1.5 hover:brightness-105 active:translate-y-1"
                    >
                      <Save className="w-4 h-4" />
                      {editingProductId ? 'Perbarui Kue di Katalog' : 'Simpan Kue ke Katalog'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Profitability Analysis Dashboard */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* Live Card Preview Mockup */}
                <section className="bg-surface-container p-6 rounded-[26px] border border-border-line space-y-4">
                  <h4 className="font-display text-xs text-on-surface-variant uppercase tracking-wider">Tampilan Pratinjau Katalog</h4>
                  
                  <div className="bg-white rounded-3xl overflow-hidden border border-border-line shadow-sm max-w-[280px] mx-auto">
                    <div className="aspect-[4/3] bg-surface-container-low relative">
                      {prodImage ? (
                        <img src={prodImage} alt={prodName} className="w-full h-full object-cover animate-fade-in" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-on-surface-variant text-xs">Belum ada foto</div>
                      )}
                      {prodBadge && (
                        <span className="absolute top-3 left-3 bg-secondary text-white font-display text-[9px] tracking-wider uppercase px-2.5 py-0.5 rounded-full font-bold">
                          {prodBadge}
                        </span>
                      )}
                    </div>
                    <div className="p-4 space-y-2">
                      <p className="text-[10px] text-secondary font-bold uppercase tracking-wider">{prodCategory}</p>
                      <h5 className="font-display text-sm text-primary font-bold truncate">{prodName || 'Nama Kue'}</h5>
                      <p className="text-[11px] text-on-surface-variant line-clamp-2 h-8 leading-snug">{prodDescription || 'Deskripsi singkat produk.'}</p>
                      
                      <div className="flex items-center justify-between pt-1">
                        <div>
                          {prodOriginalPrice > 0 && (
                            <p className="text-[10px] text-on-surface-variant line-through">Rp {prodOriginalPrice.toLocaleString('id-ID')}</p>
                          )}
                          <p className="font-display text-sm text-secondary font-bold">Rp {prodPrice.toLocaleString('id-ID')}</p>
                        </div>
                        <button type="button" className="bg-primary text-white text-[10px] font-bold px-3 py-1.5 rounded-full">
                          + Beli
                        </button>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Profitability dynamic calculator card */}
                <section className="bg-primary text-on-primary p-6 rounded-[26px] shadow-md space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-butter-yellow rounded-full blur-[40px] opacity-15" />
                  
                  <h4 className="font-display text-md text-butter-yellow pb-2 border-b border-white/10 flex items-center gap-2">
                    <LinkIcon className="w-4 h-4 text-butter-yellow" />
                    Analisis Profitabilitas Menu
                  </h4>

                  {(() => {
                    const linkedRecipe = recipes.find(r => r.id === prodLinkedRecipeId);
                    if (!linkedRecipe) {
                      return (
                        <div className="space-y-2">
                          <p className="text-xs opacity-90 leading-relaxed">
                            Hubungkan kue ini dengan resep HPP di sebelah kiri untuk melihat rincian biaya bahan baku, biaya overhead, dan margin keuntungan secara realtime.
                          </p>
                          <div className="bg-white/10 p-3 rounded-xl border border-white/10 text-[11px] italic text-center">
                            ⚠️ Belum ada resep terhubung.
                          </div>
                        </div>
                      );
                    }

                    // Calculate actual HPP
                    const matCost = linkedRecipe.ingredients.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);
                    const overhead = linkedRecipe.packagingCost + linkedRecipe.utilityCost;
                    const hpp = (matCost + overhead) / Math.max(1, linkedRecipe.yieldQty);
                    
                    const grossProfit = prodPrice - hpp;
                    const profitMarginPercent = Math.round((grossProfit / prodPrice) * 100);

                    let statusClass = 'bg-emerald-600';
                    let statusText = 'Sangat Sehat &amp; Menguntungkan';
                    let statusLabel = 'EXCELLENT';
                    if (profitMarginPercent >= 45) {
                      statusClass = 'bg-emerald-600';
                      statusText = 'Margin Sangat Sehat (>= 45%). Sangat direkomendasikan!';
                      statusLabel = 'SEHAT';
                    } else if (profitMarginPercent >= 20) {
                      statusClass = 'bg-amber-600';
                      statusText = 'Margin Cukup (20%-45%). Tetap pantau harga pasar bahan baku.';
                      statusLabel = 'CUKUP';
                    } else if (profitMarginPercent >= 0) {
                      statusClass = 'bg-orange-600';
                      statusText = 'Margin Tipis (< 20%). Pertimbangkan menaikkan harga jual kue.';
                      statusLabel = 'TIPIS';
                    } else {
                      statusClass = 'bg-red-600';
                      statusText = '⚠️ JUAL RUGI! Harga jual berada di bawah HPP bahan baku!';
                      statusLabel = 'RUGI';
                    }

                    return (
                      <div className="space-y-4 text-xs text-white">
                        <div className="space-y-2.5">
                          <div className="flex justify-between">
                            <span className="opacity-75">Resep Terhubung</span>
                            <span className="font-bold text-butter-yellow">{linkedRecipe.name}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-75">Biaya Produksi (HPP)</span>
                            <span className="font-bold">Rp {Math.round(hpp).toLocaleString('id-ID')} / Box</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="opacity-75">Harga Jual Kue</span>
                            <span className="font-bold">Rp {prodPrice.toLocaleString('id-ID')}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-[10px] opacity-60 uppercase font-bold">Keuntungan Bersih</p>
                            <p className="font-display text-lg text-butter-yellow font-bold">Rp {Math.round(grossProfit).toLocaleString('id-ID')}</p>
                          </div>
                          <div>
                            <p className="text-[10px] opacity-60 uppercase font-bold">Margin Keuntungan</p>
                            <p className="font-display text-lg text-butter-yellow font-bold">{profitMarginPercent}%</p>
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl border border-white/10 ${statusClass} text-white font-bold text-[10px] leading-snug`}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="uppercase tracking-wider text-[8px] bg-black/25 px-1.5 py-0.5 rounded font-bold">{statusLabel}</span>
                          </div>
                          {statusText}
                        </div>
                      </div>
                    );
                  })()}
                </section>

              </div>
            </div>

            {/* List Table of Menu Items */}
            <section className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-display text-xl text-primary">Daftar Menu &amp; Katalog Toko ({products.length} Kue)</h3>
                
                <div className="relative max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
                    <Search className="w-4 h-4" />
                  </span>
                  <input 
                    type="text"
                    value={searchProductQuery}
                    onChange={(e) => setSearchProductQuery(e.target.value)}
                    placeholder="Cari menu..."
                    className="pl-9 pr-4 py-2 w-full rounded-full border border-outline-variant text-xs outline-none focus:border-secondary bg-white"
                  />
                </div>
              </div>

              <div className="bg-white rounded-[26px] border border-border-line overflow-hidden shadow-sm">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-surface-container-low border-b border-border-line font-bold text-on-surface-variant uppercase tracking-wider">
                        <th className="px-6 py-3.5">Kue / Menu</th>
                        <th className="px-6 py-3.5">Kategori</th>
                        <th className="px-6 py-3.5 text-right">Harga Jual</th>
                        <th className="px-6 py-3.5">Resep Terhubung</th>
                        <th className="px-6 py-3.5 text-right">HPP</th>
                        <th className="px-6 py-3.5 text-right font-bold">Margin (%)</th>
                        <th className="px-6 py-3.5 text-center">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-line">
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchProductQuery.toLowerCase()))
                        .map((p) => {
                          const linkedRecipe = recipes.find(r => r.id === p.recipeId);
                          let hpp = 0;
                          let profitMarginPercent = 0;
                          
                          if (linkedRecipe) {
                            const matCost = linkedRecipe.ingredients.reduce((sum, item) => sum + (item.qty * item.pricePerUnit), 0);
                            const overhead = linkedRecipe.packagingCost + linkedRecipe.utilityCost;
                            hpp = (matCost + overhead) / Math.max(1, linkedRecipe.yieldQty);
                            profitMarginPercent = Math.round(((p.price - hpp) / p.price) * 100);
                          }

                          return (
                            <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0 border border-border-line">
                                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <p className="font-bold text-primary">{p.name}</p>
                                      {p.badge && (
                                        <span className="bg-secondary/10 text-secondary font-bold text-[8px] px-1.5 py-0.5 rounded">
                                          {p.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-on-surface-variant font-sans line-clamp-1 max-w-[240px]">{p.description}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <span className="bg-surface-container border border-border-line px-2 py-0.5 rounded-full font-bold text-[10px]">
                                  {p.category}
                                </span>
                              </td>
                              <td className="px-6 py-4 text-right font-bold text-primary">
                                {p.originalPrice && p.originalPrice > p.price && (
                                  <span className="text-[10px] text-on-surface-variant line-through mr-1 font-normal">
                                    Rp {p.originalPrice.toLocaleString('id-ID')}
                                  </span>
                                )}
                                Rp {p.price.toLocaleString('id-ID')}
                              </td>
                              <td className="px-6 py-4 text-on-surface-variant">
                                {linkedRecipe ? (
                                  <span className="text-secondary font-bold">{linkedRecipe.name}</span>
                                ) : (
                                  <span className="text-gray-400 italic">Belum terhubung</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right font-medium">
                                {linkedRecipe ? (
                                  `Rp ${Math.round(hpp).toLocaleString('id-ID')}`
                                ) : (
                                  <span className="text-gray-400 font-normal italic">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-right">
                                {linkedRecipe ? (
                                  <span className={`font-bold px-2.5 py-0.5 rounded-full text-[10px] ${
                                    profitMarginPercent >= 45 
                                      ? 'bg-green-100 text-green-800' 
                                      : profitMarginPercent >= 20 
                                        ? 'bg-amber-100 text-amber-800' 
                                        : 'bg-red-100 text-red-800'
                                  }`}>
                                    {profitMarginPercent}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400 italic">-</span>
                                )}
                              </td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex items-center justify-center gap-1.5">
                                  <button 
                                    type="button"
                                    onClick={() => handleLoadProduct(p)}
                                    className="p-1.5 hover:bg-surface-container rounded-full text-on-surface-variant"
                                    title="Edit Kue"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>
                                  <button 
                                    type="button"
                                    onClick={() => handleDeleteProduct(p.id)}
                                    className="p-1.5 hover:bg-red-50 text-red-500 rounded-full"
                                    title="Hapus Kue"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </div>
        )}

      </main>

      {/* Payment Proof Verification Image Lightbox Modal Overlay */}
      {activeProofUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl overflow-hidden max-w-md w-full relative p-4 space-y-4 shadow-2xl text-on-surface">
            <button 
              type="button"
              onClick={() => setActiveProofUrl(null)}
              className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full text-primary"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="font-display text-md text-primary pt-2">Bukti Pengiriman Transfer</h4>
            <div className="aspect-[3/4] rounded-2xl overflow-hidden border border-border-line bg-surface-container">
              <img 
                src={activeProofUrl} 
                alt="Payment proof original size"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => setActiveProofUrl(null)}
              className="w-full py-2.5 bg-primary text-white rounded-xl font-bold text-xs"
            >
              Tutup Pratinjau
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
