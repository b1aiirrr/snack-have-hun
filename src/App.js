import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Trash2, Search, Menu, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpeedInsights } from '@vercel/speed-insights/react';

// --- FULL MENU DATA (Based on your Prompt) ---
const MENU_DATA = [
  {
    id: 'fries', name: 'Fries & Chips', icon: '🍟',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden and crispy' },
      { id: 102, name: 'Masala Chips', price: 150, desc: 'Spicy tomato sauce coating' },
      { id: 103, name: 'Garlic Chips', price: 120, desc: 'Tossed in garlic butter' },
      { id: 104, name: 'Paprika Chips', price: 120, desc: 'Dusting of smoked paprika' },
      { id: 105, name: 'Potato Wedges', price: 100, desc: 'Thick cut, seasoned' },
    ]
  },
  {
    id: 'mains', name: 'Main Course', icon: '🍖',
    items: [
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Succulent pork bites' },
      { id: 202, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet and savory' },
      { id: 203, name: 'Wet Fry Beef', price: 300, desc: 'Rich gravy sauce' },
      { id: 204, name: 'Honey Glazed Wings', price: 300, desc: 'Sticky chicken wings' },
      { id: 205, name: 'Pilau', price: 150, desc: 'Spiced rice (Side)' },
    ]
  },
  {
    id: 'snacks', name: 'Snacks & Bites', icon: '🥟',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Crispy pastry triangle' },
      { id: 302, name: 'Chicken Spring Roll', price: 50, desc: 'Golden fried roll' },
      { id: 303, name: 'Smokies', price: 50, desc: 'Kenya classic' },
      { id: 304, name: 'Burger', price: 150, desc: 'Classic beef patty' },
    ]
  },
  {
    id: 'drinks', name: 'Beverages', icon: '🥤',
    items: [
      { id: 401, name: 'Soda (300ml)', price: 80, desc: 'Cold & Refreshing' },
      { id: 402, name: 'Milkshake', price: 150, desc: 'Strawberry / Vanilla / Choco' },
      { id: 403, name: 'Minute Maid', price: 100, desc: 'Fruit Juice' },
    ]
  },
  {
    id: 'combos', name: 'Signature Combos', icon: '🌟',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Drink' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken + Masala Chips + Drink' },
      { id: 503, name: 'Family Feast', price: 1500, desc: '3 Mains + 3 Sides + 3 Drinks' },
    ]
  }
];

// --- APP COMPONENT ---
export default function App() {
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);

  // Add to Cart Logic
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showNotification(`Added ${item.name} to cart`);
  };

  // Remove/Update Logic
  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, qty: Math.max(0, item.qty + delta) };
      }
      return item;
    }).filter(i => i.qty > 0));
  };

  const showNotification = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 2000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800">
      <SpeedInsights />
      
      {/* HEADER / NAV */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="bg-orange-600 p-2 rounded-lg text-white font-bold text-xl">SHH</div>
          <h1 className="font-bold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-2 hover:bg-orange-100 rounded-full transition"
          >
            <ShoppingCart className="text-orange-700" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((a,b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* HERO SECTION */}
      <div className="relative h-64 bg-gradient-to-r from-orange-600 to-amber-700 text-white flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1541592103007-ceb5d81a3b74?auto=format&fit=crop&q=80')] bg-cover bg-center"></div>
        <div className="relative z-10 text-center px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-2">Kenyan Street Food, Elevated.</h2>
          <p className="text-orange-100 text-lg">From Masala Chips to Honey Glazed Pork.</p>
        </div>
      </div>

      {/* SEARCH & FILTER */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-8">
          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 w-full md:w-auto no-scrollbar">
            {MENU_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-semibold transition-all ${
                  activeCategory === cat.id 
                  ? 'bg-orange-600 text-white shadow-lg shadow-orange-200' 
                  : 'bg-white text-gray-600 hover:bg-orange-100'
                }`}
              >
                {cat.icon} {cat.name}
              </button>
            ))}
          </div>
          
          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search cravings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-full border border-orange-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* MENU GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MENU_DATA
            .find(c => c.id === activeCategory)
            .items
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
                className="bg-white rounded-2xl p-4 shadow-sm border border-orange-50 hover:shadow-xl hover:border-orange-200 transition-all group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-lg text-gray-800">{item.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{item.desc}</p>
                  </div>
                  <span className="bg-orange-100 text-orange-800 font-bold px-3 py-1 rounded-lg text-sm">
                    KES {item.price}
                  </span>
                </div>
                <div className="mt-4 flex justify-end">
                  <button 
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-orange-600 transition-colors"
                  >
                    <Plus size={16} /> Add
                  </button>
                </div>
              </motion.div>
          ))}
        </div>
      </div>

      {/* CART SIDEBAR (Mobile Friendly) */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-96 bg-white z-50 shadow-2xl p-6 flex flex-col"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-orange-950">Your Order</h2>
                <button onClick={() => setIsCartOpen(false)}><X className="text-gray-400 hover:text-red-500" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-20">
                    <ShoppingCart size={48} className="mx-auto mb-2 opacity-20" />
                    <p>Your stomach is empty!</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-orange-50 p-3 rounded-xl">
                      <div>
                        <p className="font-bold text-sm">{item.name}</p>
                        <p className="text-xs text-gray-500">KES {item.price * item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white px-2 py-1 rounded-lg shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-orange-600"><Minus size={14}/></button>
                        <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-orange-600"><Plus size={14}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-6 mt-4">
                <div className="flex justify-between text-xl font-bold mb-6">
                  <span>Total</span>
                  <span className="text-orange-600">KES {cartTotal}</span>
                </div>
                <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex justify-center items-center gap-2">
                  Checkout via M-Pesa <CheckCircle size={20} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl z-50 text-sm font-medium"
          >
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}