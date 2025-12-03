import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, MapPin, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

// --- IMAGE COMPONENT (Local File Handler) ---
const FoodImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-orange-50 text-orange-800 p-2">
          <span className="text-2xl mb-1">🥘</span>
          <span className="text-[10px] font-bold uppercase text-center">{alt}</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
          onError={() => setError(true)}
        />
      )}
    </div>
  );
};

const Logo = ({ className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 border-2 border-white">
      <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
    </div>
  </div>
);

// --- MENU DATA LINKED TO YOUR LOCAL FILES ---
const INITIAL_MENU = [
  {
    id: 'fries', 
    name: 'Fries & Chips', 
    icon: '🍟',
    hero: '/food/hero_fries.jpg',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden, crispy potato sticks with a light salt touch.', img: '/food/classic_fries.jpg' },
      { id: 102, name: 'Plain Chips', price: 100, desc: 'Thick-cut and home-style, perfect for dipping.', img: '/food/plain_chips.jpg' },
      { id: 103, name: 'Masala Chips', price: 150, desc: 'Spicy, saucy, and bold—Nairobi’s favorite.', img: '/food/masala_chips.jpg' },
      { id: 104, name: 'Garlic Chips', price: 120, desc: 'Crispy chips tossed in aromatic garlic butter.', img: '/food/garlic_chips.jpg' },
      { id: 105, name: 'Paprika Chips', price: 120, desc: 'Smoky and vibrant with a paprika kick.', img: '/food/paprika_chips.jpg' },
      { id: 106, name: 'Potato Sauté', price: 100, desc: 'Tender cubes sautéed with herbs and a hint of spice.', img: '/food/potato_saute.jpg' },
      { id: 107, name: 'Potato Wedges', price: 100, desc: 'Chunky, crispy edges with a soft center.', img: '/food/potato_wedges.jpg' },
    ]
  },
  {
    id: 'mains', 
    name: 'Main Course', 
    icon: '🍖',
    hero: '/food/hero_mains.jpg',
    items: [
      // Pork
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Crispy, seasoned pork bites with a savory crunch.', img: '/food/pork_dry.jpg' },
      { id: 202, name: 'Wet Fry Pork', price: 350, desc: 'Juicy pork simmered in rich tomato and onion sauce.', img: '/food/pork_wet.jpg' },
      { id: 203, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet and sticky with a caramelized finish.', img: '/food/pork_honey.jpg' },
      // Beef
      { id: 204, name: 'Dry Fry Beef', price: 300, desc: 'Spiced and seared to perfection—classic Kenyan comfort.', img: '/food/beef_dry.jpg' },
      { id: 205, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef in a flavorful stew.', img: '/food/beef_wet.jpg' },
      // Chicken
      { id: 206, name: 'Dry Fry Chicken', price: 300, desc: 'Crispy chicken chunks with bold seasoning.', img: '/food/chicken_dry.jpg' },
      { id: 207, name: 'Wet Fry Chicken', price: 300, desc: 'Juicy chicken simmered in savory sauce.', img: '/food/chicken_wet.jpg' },
      { id: 208, name: 'Stir-Fried Wings', price: 300, desc: 'Tossed in herbs and spice—crispy and crave-worthy.', img: '/food/wings_stirfry.jpg' },
      { id: 209, name: 'Honey Glazed Wings', price: 300, desc: 'Sweet, sticky, and finger-licking good.', img: '/food/wings_honey.jpg' },
      // Sides
      { id: 210, name: 'Plain Rice', price: 100, desc: 'Soft, fluffy, and perfect for soaking up sauces.', img: '/food/rice.jpg' },
      { id: 211, name: 'Pilau', price: 150, desc: 'Aromatic spiced rice with a rich, savory depth.', img: '/food/pilau.jpg' },
      { id: 212, name: 'Ugali', price: 50, desc: 'Kenya’s classic maize staple—firm, filling, and comforting.', img: '/food/ugali.jpg' }, 
    ]
  },
  {
    id: 'snacks', 
    name: 'Snacks & Bites', 
    icon: '🥟',
    hero: '/food/hero_snacks.jpg',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Crispy triangle stuffed with spicy minced beef.', img: '/food/samosa_beef.jpg' },
      { id: 302, name: 'Chicken Samosa', price: 50, desc: 'Flaky pastry filled with tender chicken bits.', img: '/food/samosa_chicken.jpg' },
      { id: 303, name: 'Vegetable Samosa', price: 50, desc: 'Light and crunchy with a veggie-packed center.', img: '/food/samosa_veg.jpg' },
      { id: 304, name: 'Beef Spring Roll', price: 50, desc: 'Rolled and fried with savory beef filling.', img: '/food/roll_beef.jpg' },
      { id: 305, name: 'Chicken Spring Roll', price: 50, desc: 'Crispy shell with juicy chicken inside.', img: '/food/roll_chicken.jpg' },
      { id: 306, name: 'Vegetable Spring Roll', price: 50, desc: 'Crunchy and fresh with seasoned veggies.', img: '/food/roll_veg.jpg' },
      { id: 307, name: 'Meat Pies', price: 50, desc: 'Buttery crust with a hearty meat filling.', img: '/food/pie_meat.jpg' },
      { id: 308, name: 'Chicken Pies', price: 50, desc: 'Soft pastry packed with creamy chicken.', img: '/food/pie_chicken.jpg' },
      { id: 309, name: 'Sausages', price: 50, desc: 'Juicy and grilled—perfect on the go.', img: '/food/sausage.jpg' },
      { id: 310, name: 'Smokies', price: 50, desc: 'Smoky, savory, and satisfying.', img: '/food/smokie.jpg' },
      { id: 311, name: 'Hot Dogs', price: 150, desc: 'Classic bun with sausage and toppings.', img: '/food/hotdog.jpg' },
      { id: 312, name: 'Burgers', price: 150, desc: 'Toasted bun, juicy patty, and fresh fixings.', img: '/food/burger.jpg' },
    ]
  },
  {
    id: 'drinks', 
    name: 'Beverages', 
    icon: '🥤',
    hero: '/food/hero_drinks.jpg',
    items: [
      { id: 401, name: 'Sodas', price: 80, desc: 'Fizzy and refreshing—choose your favorite.', img: '/food/soda.jpg' },
      { id: 402, name: 'Minute Maid', price: 100, desc: 'Fruity and sweet, served chilled.', img: '/food/juice.jpg' },
      { id: 403, name: 'Smoothies', price: 150, desc: 'Blended fresh with tropical fruits.', img: '/food/smoothie.jpg' },
      { id: 404, name: 'Milkshakes', price: 150, desc: 'Creamy, cool, and indulgent.', img: '/food/milkshake.jpg' },
      { id: 405, name: 'Water', price: 50, desc: 'Pure hydration, always chilled.', img: '/food/water.jpg' },
    ]
  },
  {
    id: 'combos', 
    name: 'Signature Combos', 
    icon: '🌟',
    hero: '/food/hero_combos.jpg',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Minute Maid/Water.', img: '/food/combo_hog.jpg' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken/Wings + Masala Chips + Smoothie/Soda.', img: '/food/combo_chicken.jpg' },
      { id: 503, name: 'Retro Beef Fix', price: 500, desc: 'Dry Fry Beef + Garlic Chips + Milkshake/Water.', img: '/food/combo_beef.jpg' },
      { id: 504, name: 'The Haven Classic', price: 400, desc: 'Burger/Hot Dog + Classic Fries + Soda/Minute Maid.', img: '/food/combo_burger.jpg' },
      { id: 505, name: 'Bites & Bliss', price: 400, desc: '2 Snacks + Small Fries + Smoothie/Milkshake.', img: '/food/combo_bites.jpg' },
      { id: 506, name: 'Green Escape', price: 300, desc: 'Veg Samosa + Veg Spring Roll + Plain Chips + Smoothie.', img: '/food/combo_veg.jpg' },
      { id: 507, name: 'Little Haven Combo', price: 400, desc: 'Mini Burger/Hot Dog + Small Fries + Juice/Water.', img: '/food/combo_kids.jpg' },
      { id: 508, name: 'Family Feast', price: 1500, desc: '3 Mains + 3 Sides + 3 Drinks. A hearty spread for sharing.', img: '/food/combo_family.jpg' },
    ]
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing 
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const activeCatData = INITIAL_MENU.find(c => c.id === activeCategory);

  // --- DEMO PAYMENT (Guaranteed Success for Presentation) ---
  const handleMpesaPayment = () => {
    if (!phoneNumber) { alert("Please enter a phone number"); return; }
    
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      alert(`✅ STK Push Sent to ${phoneNumber}!\n\nPAYMENT RECEIVED: KES ${cartTotal}\n\nYour order is now being prepared.`);
      setCart([]);
      setIsCartOpen(false);
    }, 2500); 
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20 selection:bg-orange-200">
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-extrabold text-xl hidden sm:block text-orange-950 tracking-tight">Snack Have Hun</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 hover:bg-orange-50 rounded-full transition-all duration-300 active:scale-95">
            <ShoppingCart className="text-orange-700 w-6 h-6" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                {cart.reduce((a,b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION - Taller & Bolder */}
      <div className="relative h-[450px] text-white flex items-center overflow-hidden shadow-2xl">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105"
          style={{ backgroundImage: `url('${activeCatData?.hero}')` }}
        ></div>
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
        
        <div className="relative z-10 px-6 w-full max-w-6xl mx-auto">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg flex items-center gap-1">
                <MapPin size={12} /> Nairobi
              </span>
              <span className="text-orange-200 text-sm font-bold tracking-wide uppercase border border-orange-400/30 px-3 py-1 rounded-full backdrop-blur-sm">
                {activeCatData?.name}
              </span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black shadow-black drop-shadow-2xl leading-tight mb-6">
              Taste the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Heat.</span><br/>
              Love the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-400">Flavor.</span>
            </h2>
            <button 
              onClick={() => document.getElementById('menu-grid').scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-orange-950 px-8 py-3.5 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-50 transition-all hover:scale-105 shadow-xl"
            >
              Order Now <ChevronRight size={16} className="text-orange-600" />
            </button>
          </motion.div>
        </div>
      </div>

      {/* CATEGORY TABS - Sticky & Smooth */}
      <div className="sticky top-[65px] z-30 bg-white/90 backdrop-blur-lg py-4 border-b border-orange-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar pb-1">
          {INITIAL_MENU.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm flex items-center gap-2 border ${
                activeCategory === cat.id 
                ? 'bg-orange-900 text-white border-orange-900 scale-105 shadow-md' 
                : 'bg-white text-gray-600 border-gray-200 hover:border-orange-300 hover:text-orange-900'
              }`}
            >
              <span className="text-lg">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* MENU GRID */}
      <div id="menu-grid" className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-end gap-3 mb-8 border-b-2 border-orange-100 pb-4">
          <h3 className="text-3xl font-black text-gray-900">{activeCatData?.name}</h3>
          <span className="text-gray-400 text-sm font-medium mb-1">({activeCatData?.items.length} Delicious Items)</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCatData?.items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-3xl p-0 shadow-lg shadow-orange-100/50 border border-orange-50 flex flex-col justify-between h-full overflow-hidden group hover:shadow-2xl hover:shadow-orange-200/50 transition-all duration-300"
            >
              {/* IMAGE SECTION */}
              <div className="h-56 overflow-hidden relative">
                <FoodImage src={item.img} alt={item.name} />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-black text-orange-900 shadow-md border border-orange-100">
                  KES {item.price}
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="p-6 flex flex-col flex-grow relative">
                <div className="mb-4">
                  <h3 className="font-bold text-xl text-gray-900 leading-tight mb-2 group-hover:text-orange-700 transition-colors">{item.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                </div>
                
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white transition-all mt-auto shadow-sm active:scale-95"
                >
                  <Plus size={18} /> Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CART MODAL (Mobile Friendly) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.6 }} exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="fixed inset-0 bg-black z-50 backdrop-blur-sm" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white z-[60] shadow-2xl p-0 flex flex-col h-full"
            >
              {/* CART HEADER */}
              <div className="p-6 bg-white border-b border-gray-100 flex justify-between items-center shadow-sm z-10">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Your Tray</h2>
                  <p className="text-xs text-gray-500 font-medium">{cart.reduce((a,b) => a + b.qty, 0)} items pending</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors"><X className="text-gray-400 hover:text-red-500" /></button>
              </div>

              {/* CART ITEMS */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4 opacity-50">
                    <ShoppingCart size={64} strokeWidth={1} />
                    <p className="font-medium text-lg">Your tray is empty!</p>
                  </div>
                ) : ( 
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <img src={item.img} alt="" className="w-full h-full object-cover"/>
                        </div>
                        <div>
                          <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                          <p className="text-xs text-orange-600 font-bold mt-0.5">KES {item.price * item.qty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-2 py-1.5 border border-gray-200">
                        <button onClick={() => updateQty(item.id, -1)} className="text-gray-400 hover:text-red-500 p-1"><Minus size={14}/></button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-gray-400 hover:text-green-600 p-1"><Plus size={14}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* CHECKOUT SECTION */}
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-10">
                <div className="flex justify-between text-xl font-black mb-6 text-gray-900">
                  <span>Total</span>
                  <span className="text-orange-600">KES {cartTotal}</span>
                </div>
                
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-[10px] font-bold text-gray-400 uppercase absolute top-2 left-4">M-Pesa Number</label>
                    <input 
                      type="tel" 
                      placeholder="e.g. 0712 345 678" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pt-7 pb-3 px-4 font-mono text-base font-medium focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                    />
                  </div>
                  
                  <button 
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || cartTotal === 0}
                    className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transition-all flex justify-center items-center gap-3 active:scale-95 ${
                      isProcessing 
                      ? 'bg-gray-800 text-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-orange-600 to-red-600 text-white hover:shadow-2xl'
                    }`}
                  >
                    {isProcessing ? (
                      <>Processing Order...</>
                    ) : (
                      <>Pay Now <CheckCircle size={20} /></>
                    )}
                  </button>
                  <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest">Secured by M-Pesa</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <Analytics />
    </div>
  );
}