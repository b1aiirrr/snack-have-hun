import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

const Logo = ({ className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
      <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
    </div>
  </div>
);

// --- MENU DATA USING LOCAL IMAGES ---
// Note: We use the same image for items in a category to save time initially.
// You can download more images later and change the filenames here.
const INITIAL_MENU = [
  {
    id: 'fries', 
    name: 'Fries & Chips', 
    icon: '🍟',
    hero: '/food/fries.jpg', // Local File
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden, crispy potato sticks.', img: '/food/fries.jpg' },
      { id: 102, name: 'Plain Chips', price: 100, desc: 'Thick-cut home-style chips.', img: '/food/fries.jpg' },
      { id: 103, name: 'Masala Chips', price: 150, desc: 'Spicy, saucy, and bold.', img: '/food/fries.jpg' },
      { id: 104, name: 'Garlic Chips', price: 120, desc: 'Tossed in garlic butter.', img: '/food/fries.jpg' },
      { id: 105, name: 'Paprika Chips', price: 120, desc: 'Smoky paprika kick.', img: '/food/fries.jpg' },
      { id: 106, name: 'Potato Sauté', price: 100, desc: 'Sautéed with herbs.', img: '/food/fries.jpg' },
      { id: 107, name: 'Potato Wedges', price: 100, desc: 'Chunky and crispy.', img: '/food/fries.jpg' },
    ]
  },
  {
    id: 'mains', 
    name: 'Main Course', 
    icon: '🍖',
    hero: '/food/pork.jpg', // Local File
    items: [
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Crispy seasoned pork bites.', img: '/food/pork.jpg' },
      { id: 202, name: 'Wet Fry Pork', price: 350, desc: 'Juicy pork in tomato gravy.', img: '/food/pork.jpg' },
      { id: 203, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet sticky pork.', img: '/food/pork.jpg' },
      { id: 204, name: 'Dry Fry Beef', price: 300, desc: 'Spiced seared beef.', img: '/food/pork.jpg' },
      { id: 205, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef stew.', img: '/food/pork.jpg' },
      { id: 206, name: 'Dry Fry Chicken', price: 300, desc: 'Crispy seasoned chicken.', img: '/food/pork.jpg' },
      { id: 207, name: 'Wet Fry Chicken', price: 300, desc: 'Chicken in savory sauce.', img: '/food/pork.jpg' },
      { id: 208, name: 'Stir-Fried Wings', price: 300, desc: 'Herb tossed crispy wings.', img: '/food/pork.jpg' },
      { id: 209, name: 'Honey Glazed Wings', price: 300, desc: 'Sweet and sticky.', img: '/food/pork.jpg' },
      { id: 210, name: 'Plain Rice', price: 100, desc: 'Soft steamed rice.', img: '/food/pork.jpg' },
      { id: 211, name: 'Pilau', price: 150, desc: 'Aromatic spiced rice.', img: '/food/pork.jpg' },
      { id: 212, name: 'Ugali', price: 50, desc: 'Classic maize staple.', img: '/food/pork.jpg' },
    ]
  },
  {
    id: 'snacks', 
    name: 'Snacks & Bites', 
    icon: '🥟',
    hero: '/food/samosa.jpg', // Local File
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Spiced beef triangle.', img: '/food/samosa.jpg' },
      { id: 302, name: 'Chicken Samosa', price: 50, desc: 'Chicken filled pastry.', img: '/food/samosa.jpg' }, 
      { id: 303, name: 'Vegetable Samosa', price: 50, desc: 'Veggie filled crunch.', img: '/food/samosa.jpg' },
      { id: 304, name: 'Beef Spring Roll', price: 50, desc: 'Rolled and fried savory beef.', img: '/food/samosa.jpg' },
      { id: 305, name: 'Chicken Spring Roll', price: 50, desc: 'Juicy chicken roll.', img: '/food/samosa.jpg' },
      { id: 306, name: 'Vegetable Spring Roll', price: 50, desc: 'Seasoned veggie roll.', img: '/food/samosa.jpg' },
      { id: 307, name: 'Meat Pies', price: 50, desc: 'Buttery crust with meat filling.', img: '/food/samosa.jpg' },
      { id: 308, name: 'Chicken Pies', price: 50, desc: 'Soft pastry with creamy chicken.', img: '/food/samosa.jpg' },
      { id: 309, name: 'Sausages', price: 50, desc: 'Juicy grilled beef sausage.', img: '/food/samosa.jpg' },
      { id: 310, name: 'Smokies', price: 50, desc: 'Smoked sausage.', img: '/food/samosa.jpg' },
      { id: 311, name: 'Hot Dogs', price: 150, desc: 'Classic bun with sausage.', img: '/food/samosa.jpg' },
      { id: 312, name: 'Burgers', price: 150, desc: 'Toasted bun, juicy patty.', img: '/food/burger.jpg' },
    ]
  },
  {
    id: 'drinks', 
    name: 'Beverages', 
    icon: '🥤',
    hero: '/food/soda.jpg', // Local File
    items: [
      { id: 401, name: 'Sodas', price: 80, desc: 'Fizzy and refreshing.', img: '/food/soda.jpg' },
      { id: 402, name: 'Minute Maid', price: 100, desc: 'Fruity and sweet.', img: '/food/soda.jpg' },
      { id: 403, name: 'Smoothies', price: 150, desc: 'Blended fresh fruits.', img: '/food/soda.jpg' },
      { id: 404, name: 'Milkshakes', price: 150, desc: 'Creamy and cool.', img: '/food/soda.jpg' },
      { id: 405, name: 'Water', price: 50, desc: 'Pure chilled hydration.', img: '/food/soda.jpg' },
    ]
  },
  {
    id: 'combos', 
    name: 'Signature Combos', 
    icon: '🌟',
    hero: '/food/combo.jpg', // Local File
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Drink.', img: '/food/combo.jpg' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken/Wings + Masala Chips + Drink.', img: '/food/combo.jpg' },
      { id: 503, name: 'Retro Beef Fix', price: 500, desc: 'Beef + Garlic Chips + Drink.', img: '/food/combo.jpg' },
      { id: 504, name: 'The Haven Classic', price: 400, desc: 'Burger + Fries + Drink.', img: '/food/combo.jpg' },
      { id: 505, name: 'Bites & Bliss', price: 400, desc: '2 Snacks + Fries + Drink.', img: '/food/combo.jpg' },
      { id: 506, name: 'Green Escape', price: 300, desc: 'Veg Samosa + Spring Roll + Chips.', img: '/food/combo.jpg' },
      { id: 507, name: 'Little Haven Combo', price: 400, desc: 'Mini Burger + Fries + Juice.', img: '/food/combo.jpg' },
      { id: 508, name: 'Family Feast', price: 1500, desc: '3 Mains + Sides + Drinks.', img: '/food/combo.jpg' },
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

  const handleMpesaPayment = () => {
    if (!phoneNumber) { alert("Please enter a phone number"); return; }
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`✅ STK Push Sent to ${phoneNumber}!\n\nPAYMENT RECEIVED: KES ${cartTotal}\n\nYour order is now being prepared.`);
      setCart([]);
      setIsCartOpen(false);
    }, 3000); 
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-bold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-orange-100 rounded-full transition">
            <ShoppingCart className="text-orange-700" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{cart.reduce((a,b) => a + b.qty, 0)}</span>}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative h-72 text-white flex items-end overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url('${activeCatData?.hero}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="relative z-10 px-6 py-6 w-full max-w-6xl mx-auto">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="bg-orange-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">{activeCatData?.name}</span>
            <h2 className="text-4xl md:text-5xl font-extrabold shadow-black drop-shadow-md">Kenyan Street Food, Elevated.</h2>
          </motion.div>
        </div>
      </div>

      {/* TABS */}
      <div className="sticky top-[65px] z-30 bg-orange-50/95 backdrop-blur py-4 border-b border-orange-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar">
          {INITIAL_MENU.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${activeCategory === cat.id ? 'bg-gray-900 text-white scale-105 ring-2 ring-orange-400' : 'bg-white text-gray-600 hover:bg-orange-200'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ITEMS */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">{activeCatData?.name} Menu</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCatData?.items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-xl shadow-sm border border-orange-100 flex flex-col justify-between h-full overflow-hidden">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                  <span className="bg-orange-100 text-orange-800 font-bold px-2 py-1 rounded text-sm whitespace-nowrap">KES {item.price}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{item.desc}</p>
                <button onClick={() => addToCart(item)} className="w-full bg-gray-50 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-all mt-auto"><Plus size={18} /> Add to Order</button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CART MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
                <button onClick={() => setIsCartOpen(false)}><X className="text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart.length === 0 ? <p className="text-center text-gray-400 mt-20">Cart is empty</p> : cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                    <div><p className="font-bold text-gray-800">{item.name}</p><p className="text-xs text-gray-500">KES {item.price} x {item.qty}</p></div>
                    <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm">
                      <button onClick={() => updateQty(item.id, -1)}><Minus size={16}/></button><span className="font-bold text-sm w-4 text-center">{item.qty}</span><button onClick={() => updateQty(item.id, 1)}><Plus size={16}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-6 mt-4">
                <div className="flex justify-between text-xl font-bold mb-4"><span>Total</span><span className="text-orange-600">KES {cartTotal}</span></div>
                <input type="tel" placeholder="e.g. 0712345678" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 font-mono text-lg mb-4" />
                <button onClick={handleMpesaPayment} disabled={isProcessing || cartTotal === 0} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2">{isProcessing ? 'Processing...' : 'Pay with M-Pesa'}</button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <Analytics />
    </div>
  );
}