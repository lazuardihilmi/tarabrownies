import React, { useState } from 'react';
import { motion } from 'motion/react';
import { X, Star, Sparkles, Flame, ShieldAlert, Heart, MessageSquare } from 'lucide-react';
import { Product, CartItem } from '../types';

interface ProductDetailModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (item: CartItem) => void;
}

export default function ProductDetailModal({ product, onClose, onAddToCart }: ProductDetailModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes ? product.sizes[0] : 'Standard');
  const [selectedTopping, setSelectedTopping] = useState<string>(product.toppings ? product.toppings[0] : 'None');
  const [quantity, setQuantity] = useState<number>(1);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  const handleAddToCart = () => {
    const itemPrice = product.price + (selectedSize.includes('20x20') ? 13000 : 0);
    const cartItem: CartItem = {
      id: `${product.id}-${selectedSize}-${selectedTopping}`,
      product,
      selectedSize,
      selectedTopping,
      quantity,
      price: itemPrice
    };
    onAddToCart(cartItem);
    onClose();
  };

  const reviews = [
    { name: 'Siti Aminah', avatar: '👩‍🍳', text: '"Gak nyangka rasanya bakal seenak ini. Coklatnya berasa banget, trus moist banget di dalem tapi atasnya shiny crust gitu. Recomended!"', rating: 5 },
    { name: 'Budi Santoso', avatar: '👨', text: '"Brownies terenak di kota ini fix. Gak terlalu manis jadi gak bikin eneg kalo makan banyak. Packagingnya juga cantik buat kado."', rating: 5 },
    { name: 'Dewi Lestari', avatar: '👩', text: '"Sering beli buat stok cemilan di rumah. Anak-anak suka banget. Packing aman banget nyampe rumah masih bagus teksturnya."', rating: 5 }
  ];

  const currentPrice = product.price + (selectedSize.includes('20x20') ? 13000 : 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 30 }}
        className="bg-surface text-on-surface w-full max-w-2xl rounded-[32px] overflow-hidden looms-shadow border border-border-line relative my-8"
      >
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white/80 hover:bg-white text-primary p-2 rounded-full shadow-md active:scale-90 transition-transform"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Image Banner */}
        <div className="relative h-64 md:h-80 overflow-hidden bg-surface-container-highest">
          <img 
            src={product.image} 
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 left-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {product.category}
          </div>

          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-primary text-sm font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1">
            <Star className="w-4 h-4 fill-secondary text-secondary" />
            <span>{product.rating || '4.9'} ({product.ratingCount || '120+'})</span>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 md:p-8 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="font-display text-2xl md:text-3xl text-primary leading-tight">{product.name}</h2>
              <div className="flex items-baseline gap-2 mt-2">
                <span className="font-display text-2xl text-secondary">Rp {currentPrice.toLocaleString('id-ID')}</span>
                {product.originalPrice && (
                  <span className="text-sm line-through text-on-surface-variant">
                    Rp {product.originalPrice.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            <button 
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-3 bg-surface-container hover:bg-surface-container-high rounded-full active:scale-95 transition-all"
            >
              <Heart className={`w-6 h-6 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-on-surface-variant'}`} />
            </button>
          </div>

          {/* About Section */}
          <div className="bg-surface-container-low p-5 rounded-2xl border border-border-line">
            <h3 className="font-display text-md text-primary uppercase tracking-wider mb-2">Tentang Produk</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              {product.longDescription || product.description}
            </p>
          </div>

          {/* Sizing & Options Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-label-bold text-sm text-primary uppercase tracking-wider">Pilih Ukuran</h4>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2.5 rounded-full font-bold text-xs md:text-sm border transition-all ${
                      selectedSize === size 
                        ? 'bg-butter-yellow border-primary text-primary shadow-sm' 
                        : 'bg-white border-border-line text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Toppings Options Selector */}
          {product.toppings && product.toppings.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-label-bold text-sm text-primary uppercase tracking-wider">Pilih Topping</h4>
              <div className="flex flex-wrap gap-2">
                {product.toppings.map((topping) => (
                  <button
                    key={topping}
                    onClick={() => setSelectedTopping(topping)}
                    className={`px-4 py-2 rounded-full font-bold text-xs border transition-all ${
                      selectedTopping === topping 
                        ? 'bg-secondary text-white border-secondary' 
                        : 'bg-white border-border-line text-on-surface-variant hover:bg-surface-container-low'
                    }`}
                  >
                    {topping}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity and Actions */}
          <div className="flex flex-col md:flex-row items-center gap-4 pt-2">
            <div className="flex items-center gap-3 bg-surface-container px-4 py-2 rounded-full border border-border-line shadow-sm">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-full bg-white hover:bg-surface-container-highest flex items-center justify-center font-bold text-lg text-primary transition-colors active:scale-90"
              >
                -
              </button>
              <span className="font-display text-lg text-primary w-8 text-center">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-full bg-white hover:bg-surface-container-highest flex items-center justify-center font-bold text-lg text-primary transition-colors active:scale-90"
              >
                +
              </button>
            </div>

            <button 
              onClick={handleAddToCart}
              className="tactile-button bg-butter-yellow text-primary flex-grow w-full py-4 px-6 rounded-full font-display text-sm md:text-base tracking-widest hover:brightness-105 active:translate-y-1 transition-all"
            >
              🛒 TAMBAH KE KERANJANG
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 py-2 border-y border-border-line text-xs md:text-sm text-on-surface-variant">
            <div className="flex items-center gap-2">
              <span className="text-xl">👩‍🍳</span>
              <span>Fresh Baked Daily</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl">🌿</span>
              <span>Natural Ingredients</span>
            </div>
          </div>

          {/* Testimonial reviews ("Apa Kata Mereka?") */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display text-lg text-primary">Apa Kata Mereka?</h3>
              <span className="text-xs text-secondary font-bold hover:underline cursor-pointer">Lihat Semua</span>
            </div>

            <div className="space-y-3">
              {reviews.map((rev, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-border-line space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-lg shadow-sm">
                        {rev.avatar}
                      </div>
                      <span className="font-bold text-primary">{rev.name}</span>
                    </div>
                    <div className="flex text-yellow-500">
                      {[...Array(rev.rating)].map((_, idx) => (
                        <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-on-surface-variant italic leading-relaxed">{rev.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
