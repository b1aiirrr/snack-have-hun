import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, Settings, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './Logo';
import axios from 'axios';
import 'intasend-inlinejs-sdk';

// --- SHARED DATA SOURCE (Ideally this comes from a database) ---
const INITIAL_MENU = [
  {
    id: 'fries', name: 'Fries & Chips', icon: '🍟',
    img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?auto=format&fit=crop&q=80',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden and crispy' },
      { id: 102, name: 'Masala Chips', price: 150, desc: 'Spicy tomato sauce coating' },
      { id: 103, name: 'Garlic Chips', price: 120, desc: 'Tossed in garlic butter' },
    ]
  },
  {
    id: 'mains', name: 'Main Course', icon: '🍖',
    img: 'https://images.unsplash.com/photo-1544025162-d76690b6d015?auto=format&fit=crop&q=80',
    items: [
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Succulent pork bites' },
      { id: 202, name: 'Wet Fry Beef', price: 300, desc: 'Rich gravy sauce' },
    ]
  },
  {
    id: 'drinks', name: 'Beverages', icon: '🥤',
    img: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80',
    items: [
      { id: 401, name: 'Soda (300ml)', price: 80, desc: 'Cold & Refreshing' },
      { id: 402, name: 'Milkshake', price: 150, desc: 'Strawberry / Vanilla / Choco' },
    ]
  }
];

// --- 1. HOME / ORDERING PAGE ---
function Home({ menu, addToCart, cart, updateQty, cartTotal }) {
  const [activeCategory, setActiveCategory] = useState('fries');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleMpesaPayment = () => {
    // 1. Validation: Make it look real
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }
    if (!phoneNumber.startsWith("254") && !phoneNumber.startsWith("0")) {
      alert("Please enter a valid M-Pesa number (e.g., 0712...)");
      return;
    }

    // 2. Show the "Processing" Spinner
    setIsProcessing(true);

    // 3. Simulate Network Delay (3 Seconds)
    // This creates the illusion of contacting Safaricom
    setTimeout(() => {
      setIsProcessing(false);
      
      // 4. Show the Success Message
      alert(`✅ STK Push Sent to ${phoneNumber}!\n\nPAYMENT RECEIVED: KES ${cartTotal}\n\nYour order is now being prepared.`);
      
      // 5. Clear the Cart & Close Modal (Final Polish)
      setCart([]);
      setIsCartOpen(false);
    }, 3000); 
  };

  const activeCatData = menu.find(c => c.id === activeCategory);

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-bold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1>
        </div>
        <div className="flex gap-3">
          <Link to="/admin" className="p-2 hover:bg-orange-100 rounded-full text-gray-500">
            <LayoutDashboard size={20} />
          </Link>
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-orange-100 rounded-full transition">
            <ShoppingCart className="text-orange-700" />
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cart.reduce((a,b) => a + b.qty, 0)}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* DYNAMIC HERO SECTION */}
      <div className="relative h-72 text-white flex items-end overflow-hidden transition-all duration-500">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-700"
          style={{ backgroundImage: `url('${activeCatData?.img}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 px-6 py-6 w-full max-w-6xl mx-auto">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-orange-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block">MENU</span>
            <h2 className="text-4xl md:text-6xl font-extrabold">{activeCatData?.name}</h2>
            <p className="text-gray-200 mt-2">Authentic taste, made with love.</p>
          </motion.div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-[65px] z-30 bg-orange-50/95 backdrop-blur py-4 border-b border-orange-200">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar">
          {menu.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm ${
                activeCategory === cat.id 
                ? 'bg-gray-900 text-white scale-105' 
                : 'bg-white text-gray-600 hover:bg-orange-200'
              }`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="max-w-6xl mx-auto px-4 py-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {activeCatData?.items.map((item) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-xl p-4 shadow-sm border border-orange-100 flex justify-between items-center group hover:border-orange-300 transition-all"
          >
            <div>
              <h3 className="font-bold text-gray-900">{item.name}</h3>
              <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              <span className="text-orange-600 font-bold mt-2 block">KES {item.price}</span>
            </div>
            <button 
              onClick={() => addToCart(item)}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 group-hover:bg-orange-600 group-hover:text-white transition-all"
            >
              <Plus size={20} />
            </button>
          </motion.div>
        ))}
      </div>

      {/* CART MODAL WITH M-PESA */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
                <button onClick={() => setIsCartOpen(false)}><X className="text-gray-400" /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.length === 0 ? <p className="text-center text-gray-400 mt-10">Cart is empty</p> : 
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center">
                      <div><p className="font-bold">{item.name}</p><p className="text-xs text-gray-500">@{item.price}</p></div>
                      <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-2">
                        <button onClick={() => updateQty(item.id, -1)}><Minus size={14}/></button>
                        <span className="font-bold text-sm">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)}><Plus size={14}/></button>
                      </div>
                    </div>
                  ))
                }
              </div>

              <div className="border-t pt-6 bg-gray-50 -mx-6 px-6 pb-4 mt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total</span>
                  <span className="text-orange-600">KES {cartTotal}</span>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase">M-Pesa Phone Number</label>
                  <input 
                    type="text" 
                    placeholder="2547XXXXXXXX" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-white border border-gray-300 rounded-lg p-3 font-mono text-sm focus:ring-2 focus:ring-green-500 outline-none"
                  />
                  <button 
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || cartTotal === 0}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-green-700 shadow-lg shadow-green-200 transition-all flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    {isProcessing ? 'Processing...' : `Pay KES ${cartTotal}`}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- 2. ADMIN DASHBOARD PAGE ---
function Admin({ menu }) {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* SIDEBAR */}
      <div className="w-64 bg-gray-900 text-white p-6 hidden md:block">
        <div className="mb-10"><Logo className="text-white" /></div>
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-orange-500 font-bold bg-gray-800 p-3 rounded-lg"><LayoutDashboard size={20}/> Overview</div>
          <div className="flex items-center gap-3 text-gray-400 hover:text-white p-3"><Settings size={20}/> Settings</div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <Link to="/" className="bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-bold hover:bg-gray-50">Back to Website</Link>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Total Revenue</h3>
            <p className="text-3xl font-black text-gray-800 mt-2">KES 24,500</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h3 className="text-gray-500 text-sm font-bold uppercase">Active Orders</h3>
            <p className="text-3xl font-black text-orange-600 mt-2">12</p>
          </div>
        </div>

        {/* MENU MANAGER PREVIEW */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="font-bold text-gray-800">Menu Items</h3>
            <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-bold">+ Add Item</button>
          </div>
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="p-4">Item Name</th>
                <th className="p-4">Category</th>
                <th className="p-4">Price</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {menu.flatMap(cat => cat.items.map(item => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-4 font-bold text-gray-800">{item.name}</td>
                  <td className="p-4 text-gray-500">{cat.name}</td>
                  <td className="p-4 text-gray-600">KES {item.price}</td>
                  <td className="p-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// --- MAIN APP (ROUTER) ---
export default function App() {
  const [menu] = useState(INITIAL_MENU);
  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing 
        ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i)
        : [...prev, { ...item, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home menu={menu} addToCart={addToCart} cart={cart} updateQty={updateQty} cartTotal={cartTotal} />} />
        <Route path="/admin" element={<Admin menu={menu} />} />
      </Routes>
    </BrowserRouter>
  );
}