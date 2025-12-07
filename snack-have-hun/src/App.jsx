import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, MapPin, ChevronRight, Lock, Save, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

// --- 1. SUPABASE CONNECTION (Keys from your screenshot) ---
const supabaseUrl = 'https://ohlxtnthkgawqwefbevm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9obHh0bnRoa2dhd3F3ZWZiZXZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ3OTA5MDUsImV4cCI6MjA4MDM2NjkwNX0.d_SVhnZCouU6p7cYxsIjQv196bQhaWWvhfxuCsoiUEM';
const supabase = createClient(supabaseUrl, supabaseKey);

// --- IMAGE COMPONENT ---
const FoodImage = ({ src, alt }) => {
  const [error, setError] = useState(false);
  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {error ? (
        <div className="flex flex-col items-center justify-center h-full bg-orange-50 text-orange-800 p-2 text-center">
          <span className="text-2xl mb-1">🥘</span>
          <span className="text-[10px] font-bold uppercase">{alt}</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
          onError={() => setError(true)} 
        />
      )}
    </div>
  );
};

const Logo = () => (
  <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 border-2 border-white">
    <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-sm"></div>
  </div>
);

// --- CONFIGURATION ---
const HERO_IMAGES = {
  fries: '/food/hero_fries.jpg',
  mains: '/food/hero_mains.jpg',
  snacks: '/food/hero_snacks.jpg',
  drinks: '/food/hero_drinks.jpg',
  combos: '/food/hero_combos.jpg'
};

const CATEGORY_TITLES = {
  fries: 'Fries & Chips',
  mains: 'Main Course',
  snacks: 'Snacks & Bites',
  drinks: 'Beverages',
  combos: 'Signature Combos'
};

const CATEGORY_ICONS = {
  fries: '🍟',
  mains: '🍖',
  snacks: '🥟',
  drinks: '🥤',
  combos: '🌟'
};

// --- INSTALL BUTTON ---
const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setDeferredPrompt(e); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') setDeferredPrompt(null);
  };
  if (!deferredPrompt) return null;
  return (
    <button onClick={handleInstall} className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-full text-xs font-bold animate-pulse hover:bg-gray-800 transition">
      <Download size={14} /> Install App
    </button>
  );
};

// --- STATIC MENU (Instant Load) ---
const INITIAL_MENU = [
  {
    id: 'fries', name: 'Fries & Chips', icon: '🍟', hero: '/food/hero_fries.jpg',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden, crispy potato sticks.', img: '/food/classic_fries.jpg', available: true },
      { id: 102, name: 'Plain Chips', price: 100, desc: 'Thick-cut home-style chips.', img: '/food/plain_chips.jpg', available: true },
      { id: 103, name: 'Masala Chips', price: 150, desc: 'Spicy, saucy, and bold.', img: '/food/masala_chips.jpg', available: true },
      { id: 104, name: 'Garlic Chips', price: 120, desc: 'Tossed in garlic butter.', img: '/food/garlic_chips.jpg', available: true },
      { id: 105, name: 'Paprika Chips', price: 120, desc: 'Smoky paprika kick.', img: '/food/paprika_chips.jpg', available: true },
      { id: 106, name: 'Potato Sauté', price: 100, desc: 'Sautéed with herbs.', img: '/food/potato_saute.jpg', available: true },
      { id: 107, name: 'Potato Wedges', price: 100, desc: 'Chunky and crispy.', img: '/food/potato_wedges.jpg', available: true },
    ]
  },
];

// --- 1. CUSTOMER MENU ---
const CustomerMenu = () => {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (!error && data && data.length > 0) {
        const categories = ['fries', 'mains', 'snacks', 'drinks', 'combos'];
        const grouped = categories.map(cat => ({
          id: cat,
          name: CATEGORY_TITLES[cat],
          icon: CATEGORY_ICONS[cat],
          hero: HERO_IMAGES[cat],
          items: data.filter(i => i.category === cat)
        }));
        setMenu(grouped);
      }
    };
    fetchMenu();
  }, []);

  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      return existing ? prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i) : [...prev, { ...item, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const activeCatData = menu.find(c => c.id === activeCategory) || menu[0];

  const handlePayment = async () => {
    if (!phoneNumber) return alert('Please enter your phone number');
    setIsProcessing(true);

    try {
      console.log("Calling Backend API...");
      
      // 1. Log Order to Database
      await supabase.from('orders').insert({
        phone: phoneNumber,
        total: cartTotal,
        items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
        status: 'pending_payment',
        created_at: new Date().toISOString(),
      });

      // 2. Trigger M-Pesa STK Push via Backend
      const response = await axios.post('/api/pay', {
        phoneNumber: phoneNumber,
        amount: cartTotal
      });

      console.log("Backend Reply:", response.data);

      if (response.data.ResponseCode === "0") {
        alert(`✅ STK Push Sent to ${phoneNumber}! Check your phone to enter PIN.`);
        setCart([]); 
        setIsCartOpen(false);
      } else {
        // Show the ACTUAL error from Safaricom (not generic)
        alert("❌ M-Pesa Error: " + (response.data.errorMessage || JSON.stringify(response.data)));
      }
    } catch (error) {
      console.error("Payment Failed:", error);
      // Detailed Error Reporting
      if (error.response) {
        alert(`❌ Server Error (${error.response.status}): ${JSON.stringify(error.response.data)}`);
      } else {
        alert(`❌ Connection Error: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2"><Logo /><h1 className="font-extrabold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1></div>
        <div className="flex gap-3 items-center">
          <InstallButton />
          <button onClick={() => setIsCartOpen(true)} className="relative p-2 hover:bg-orange-50 rounded-full">
            <ShoppingCart className="text-orange-700" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">{cart.reduce((a,b) => a + b.qty, 0)}</span>}
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative h-[350px] text-white flex items-end overflow-hidden shadow-xl">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-700" style={{ backgroundImage: `url('${activeCatData?.hero}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="relative z-10 px-6 py-10 w-full max-w-6xl mx-auto">
          <span className="bg-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 inline-block">{activeCatData?.name}</span>
          <h2 className="text-4xl md:text-6xl font-black drop-shadow-lg">Kenyan Street Food,<br/>Elevated.</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-[65px] z-30 bg-white/95 backdrop-blur py-3 border-b border-orange-100 shadow-sm overflow-x-auto">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 min-w-max">
          {menu.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2 rounded-full text-sm font-bold flex items-center gap-2 border transition-all ${activeCategory === cat.id ? 'bg-orange-900 text-white border-orange-900' : 'bg-white text-gray-600 border-gray-200'}`}>
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {activeCatData?.items.map((item) => (
          <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl shadow-sm border border-orange-50 overflow-hidden flex flex-col group hover:shadow-lg transition-all">
            <div className="h-48 overflow-hidden relative">
              <FoodImage src={item.img} alt={item.name} />
              {!item.available && <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold uppercase tracking-widest">Sold Out</div>}
            </div>
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                <span className="bg-orange-50 text-orange-800 font-bold px-2 py-1 rounded text-sm">KES {item.price}</span>
              </div>
              <p className="text-sm text-gray-500 mb-4 flex-grow">{item.desc || item.desc_text}</p>
              <button disabled={!item.available} onClick={() => addToCart(item)} className="w-full bg-orange-100 text-orange-800 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-orange-600 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                {item.available ? <><Plus size={18} /> Add</> : 'Unavailable'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Cart Drawer */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl p-6 flex flex-col h-full">
              <div className="flex justify-between items-center mb-6"><h2 className="text-2xl font-black">Order Tray</h2><button onClick={() => setIsCartOpen(false)}><X/></button></div>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cart.map(item => (
                  <div key={item.id} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl">
                    <div><p className="font-bold">{item.name}</p><p className="text-xs text-orange-600">KES {item.price * item.qty}</p></div>
                    <div className="flex gap-3 bg-white px-2 py-1 rounded-lg border"><button onClick={() => updateQty(item.id, -1)}>-</button><span className="font-bold text-sm w-4 text-center">{item.qty}</span><button onClick={() => updateQty(item.id, 1)}>+</button></div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-black mb-4"><span>Total</span><span className="text-orange-600">KES {cartTotal}</span></div>
                <input type="tel" placeholder="0712..." value={phoneNumber} onChange={e=>setPhoneNumber(e.target.value)} className="w-full bg-gray-100 p-4 rounded-xl mb-3 border border-gray-200"/>
                
                {/* DARAJA PAY BUTTON */}
                <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2">
                  {isProcessing ? 'Processing...' : <>Pay with M-Pesa <CheckCircle size={20}/></>}
                </button>
                <div className="mt-3 flex justify-center gap-2 opacity-50">
                  <span className="text-xs text-gray-400">Secured by Daraja API</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- 2. ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (!error) { setMenuItems(data); setLoading(false); }
    };
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '2024') setIsAuthenticated(true); else alert('Wrong PIN');
  };

  const updatePrice = async (id, newPrice) => {
    const { error } = await supabase.from('menu_items').update({ price: newPrice }).eq('id', id);
    if (!error) alert('Price Updated!');
  };

  const toggleStock = async (id, currentStatus) => {
    const { error } = await supabase.from('menu_items').update({ available: !currentStatus }).eq('id', id);
    if (!error) setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !currentStatus } : i));
  };

  if (!isAuthenticated) return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl w-full max-w-sm shadow-2xl">
        <div className="flex justify-center mb-6"><Logo /></div>
        <h2 className="text-2xl font-black text-center mb-1">Admin Access</h2>
        <form onSubmit={handleLogin} className="space-y-4 mt-6">
          <input type="password" placeholder="PIN" className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-center text-2xl tracking-widest font-black" value={password} onChange={e => setPassword(e.target.value)} />
          <button className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition">Unlock Dashboard</button>
        </form>
        <Link to="/" className="block text-center mt-6 text-sm text-gray-400 hover:text-orange-600">Back to Menu</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3"><Logo /><h2 className="font-bold text-gray-900">Admin Dashboard</h2></div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">Log Out</button>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? <p>Loading...</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
                <tr><th className="p-4">Item</th><th className="p-4">Price</th><th className="p-4 text-center">Stock</th><th className="p-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-sm text-gray-700">{item.name} <span className="text-gray-400 font-normal ml-2">({item.category})</span></td>
                    <td className="p-4"><input type="number" defaultValue={item.price} id={`price-${item.id}`} className="w-20 p-2 border rounded bg-white font-mono" /></td>
                    <td className="p-4 text-center"><button onClick={() => toggleStock(item.id, item.available)} className={`px-3 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{item.available ? 'In Stock' : 'Sold Out'}</button></td>
                    <td className="p-4"><button onClick={() => updatePrice(item.id, document.getElementById(`price-${item.id}`).value)} className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"><Save size={16}/></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

// --- MAIN ROUTER ---
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CustomerMenu />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
      <Analytics />
    </BrowserRouter>
  );
}