import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, MapPin, ChevronRight, Lock, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";
import { supabase } from './supabase';

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
  <div className="relative flex items-center">
    <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 border-2 border-white">
      <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
    </div>
    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow" />
  </div>
);

// --- HERO IMAGES ---
const HERO_IMAGES = {
  fries: '/food/hero_fries.jpg',
  mains: '/food/hero_mains.jpg',
  snacks: '/food/hero_snacks.jpg',
  drinks: '/food/hero_drinks.jpg',
  combos: '/food/hero_combos.jpg'
};

// --- TITLES & ICONS ---
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

// --- STATIC MENU (For Instant Load) ---
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
  // ... (Other categories will load from DB, but this keeps the UI stable)
];

// --- 1. CUSTOMER MENU ---
const CustomerMenu = () => {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  
  // FETCH FROM DATABASE
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (error) console.error('Error fetching menu:', error);
      else if (data && data.length > 0) {
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
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => i.id === id ? { ...i, qty: Math.max(0, i.qty + delta) } : i).filter(i => i.qty > 0));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const activeCatData = menu.find(c => c.id === activeCategory) || menu[0];

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20">
      <nav className="sticky top-0 z-40 bg-white shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2"><Logo /><h1 className="font-extrabold text-lg text-orange-950">Snack Have Hun</h1></div>
        <div className="flex gap-3">
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
                
                {/* MANUAL TILL NUMBER PAYMENT */}
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-900">
                    <p className="font-bold">Pay via M-Pesa Till Number</p>
                    <p className="mt-1">
                      1. Open <span className="font-semibold">M-Pesa</span> on your phone<br/>
                      2. Lipa na M-Pesa → Buy Goods and Services<br/>
                      3. Till Number: <span className="font-mono font-bold">6920615</span><br/>
                      4. Amount: <span className="font-mono font-bold">KES {cartTotal}</span><br/>
                      5. Use your phone number above
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      try {
                        const { error } = await supabase.from('orders').insert({
                          phone: phoneNumber,
                          total: cartTotal,
                          items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
                          status: 'pending_manual_payment',
                          created_at: new Date().toISOString(),
                        });
                        if (error) console.error('Error saving order:', error);
                      } catch (e) {
                        console.error('Unexpected error saving order:', e);
                      }
                      alert('Thank you! We will confirm your payment and start preparing your order.');
                      setCart([]);
                      setIsCartOpen(false);
                    }}
                    disabled={!phoneNumber || cartTotal <= 0}
                    className="w-full bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                  >
                    I have paid
                  </button>
                </div>
                <div className="mt-3 flex justify-center gap-2 opacity-50">
                  <span className="text-xs text-gray-400">Pay manually via M-Pesa till number 6920615</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      <footer className="mt-6 py-6 text-center text-sm text-gray-500">
        <div className="flex items-center justify-center gap-4 mb-2">
          <a href="#" className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 hover:bg-orange-50" title="Instagram" aria-label="Instagram">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-pink-500">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="1.5"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
            </svg>
          </a>

          <a href="#" className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 hover:bg-green-50" title="WhatsApp" aria-label="WhatsApp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a9.38 9.38 0 0 1-1.3 4.6l.9 3.3-3.4-.9A9.8 9.8 0 1 1 21 11.5z" stroke="currentColor" strokeWidth="1.2" fill="currentColor" />
              <path d="M16.5 14.5c-.4 0-1 .2-1.7.2-.9 0-1.6-.6-2.6-.9-.7-.2-1.2-.4-1.7.2l-.9.9c-.2.2-.5.3-.8.2-1-.3-3.2-1.2-3.2-3.7 0-2 .9-3.3 1.4-3.8.4-.4 1-.5 1.6-.5.6 0 1.2 0 1.7.1.5.1 1 .1 1.6-.1.5-.2.9-.6 1.2-1 .3-.4.6-.5 1-.5.4 0 .9.1 1.2.4.3.3 1 1 1 2.4 0 1.4-.7 2.8-.8 3.1-.1.2-.2.4-.3.4z" fill="#fff" />
            </svg>
          </a>

          <a href="#" className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 hover:bg-blue-50" title="Email" aria-label="Email">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6.5h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M21 6.5l-9 7-9-7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          <a href="#" className="p-3 bg-white border border-gray-200 rounded-lg shadow-sm flex items-center gap-2 hover:bg-black/5" title="TikTok" aria-label="TikTok">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8.5a4 4 0 0 1-4-4v7.8A4.2 4.2 0 1 0 16 8.5z" stroke="currentColor" strokeWidth="1.2"/>
              <path d="M8 21a6 6 0 0 0 8-5.8v-1.2" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </a>
        </div>
        <div className="text-xs text-gray-400">© {new Date().getFullYear()} Snack Have Hun. All rights reserved.</div>
      </footer>


    </div>
  );
};

// --- 2. ADMIN DASHBOARD ---
const AdminDashboard = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeAdminTab, setActiveAdminTab] = useState('menu');
  const [newItem, setNewItem] = useState({
    name: '',
    price: '',
    category: 'fries',
    img: '',
    desc: '',
  });
  const [addMessage, setAddMessage] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const [{ data: menuData, error: menuError }, { data: orderData, error: orderError }] = await Promise.all([
        supabase.from('menu_items').select('*').order('id'),
        supabase.from('orders').select('*').order('created_at', { ascending: false }),
      ]);
      if (!menuError) setMenuItems(menuData || []);
      if (!orderError) setOrders(orderData || []);
      setLoading(false);
    };
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '2025') setIsAuthenticated(true); else alert('Wrong PIN');
  };

  const refreshData = async () => {
    const [{ data: menuData, error: menuError }, { data: orderData, error: orderError }] = await Promise.all([
      supabase.from('menu_items').select('*').order('id'),
      supabase.from('orders').select('*').order('created_at', { ascending: false }),
    ]);
    if (!menuError) setMenuItems(menuData || []);
    if (!orderError) setOrders(orderData || []);
  };

  const updatePrice = async (id, newPrice) => {
    const { error } = await supabase.from('menu_items').update({ price: newPrice }).eq('id', id);
    if (!error) {
      refreshData();
    }
  };
  const toggleStock = async (id, currentStatus) => {
    const { error } = await supabase.from('menu_items').update({ available: !currentStatus }).eq('id', id);
    if (!error) setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !currentStatus } : i));
  };

  const deleteItem = async (id) => {
    if (!window.confirm('Delete this menu item?')) return;
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    if (!error) {
      setMenuItems(prev => prev.filter(i => i.id !== id));
    }
  };

  const addItem = async () => {
    setAddMessage('');
    if (!newItem.name || !newItem.price || !newItem.category) {
      setAddMessage('Please fill in name, price and category.');
      return;
    }

    const price = Number(newItem.price);
    if (Number.isNaN(price) || price <= 0) {
      setAddMessage('Price must be a positive number.');
      return;
    }

    const { error } = await supabase.from('menu_items').insert({
      name: newItem.name,
      price,
      category: newItem.category,
      img: newItem.img || '',
      desc: newItem.desc || '',
      available: true,
    });
    if (error) {
      console.error('Error adding item:', error);
      setAddMessage('Error adding item. Please try again.');
      return;
    }

    setAddMessage('Item added successfully.');
    setNewItem({
      name: '',
      price: '',
      category: 'fries',
      img: '',
      desc: '',
    });
    refreshData();
  };

  const updateOrderStatus = async (id, status) => {
    const { error } = await supabase.from('orders').update({ status }).eq('id', id);
    if (!error) {
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    }
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
      <div className="max-w-5xl mx-auto px-4 py-8 flex gap-6">
        {/* Side nav */}
        <div className="w-32 flex flex-col gap-2 text-sm">
          <button
            onClick={() => setActiveAdminTab('menu')}
            className={`px-3 py-2 rounded-lg font-bold text-left ${activeAdminTab === 'menu' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Menu
          </button>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-3 py-2 rounded-lg font-bold text-left ${activeAdminTab === 'orders' ? 'bg-orange-600 text-white' : 'bg-white text-gray-700 border border-gray-200'}`}
          >
            Orders
          </button>
        </div>

        {/* Main content */}
        <div className="flex-1 space-y-8">
          {activeAdminTab === 'menu' && (
            <>
              <div className="space-y-4 mb-6">
                <h3 className="font-bold text-lg">Add New Menu Item</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-xl border border-gray-200">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Food Name
                    </label>
                    <input
                      type="text"
                      value={newItem.name}
                      onChange={e => setNewItem({ ...newItem, name: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50"
                      placeholder="e.g. Classic Fries"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Price (KES)
                    </label>
                    <input
                      type="number"
                      value={newItem.price}
                      onChange={e => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50"
                      placeholder="e.g. 150"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Category
                    </label>
                    <select
                      value={newItem.category}
                      onChange={e => setNewItem({ ...newItem, category: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50"
                    >
                      <option value="fries">Fries & Chips</option>
                      <option value="mains">Main Course</option>
                      <option value="snacks">Snacks & Bites</option>
                      <option value="drinks">Beverages</option>
                      <option value="combos">Signature Combos</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Image Path
                    </label>
                    <input
                      type="text"
                      value={newItem.img}
                      onChange={e => setNewItem({ ...newItem, img: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50"
                      placeholder="/food/my_image.jpg"
                    />
                  </div>

                  <div className="space-y-1 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 uppercase">
                      Description
                    </label>
                    <textarea
                      value={newItem.desc}
                      onChange={e => setNewItem({ ...newItem, desc: e.target.value })}
                      className="w-full p-2 border rounded bg-gray-50"
                      rows={2}
                      placeholder="Short description of the item"
                    />
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between">
                    <button
                      onClick={addItem}
                      type="button"
                      className="px-4 py-2 rounded-lg bg-orange-600 text-white text-sm font-bold"
                    >
                      + Add Item
                    </button>
                    {addMessage && (
                      <span className="text-xs text-gray-600">{addMessage}</span>
                    )}
                  </div>
                </div>

                <h3 className="font-bold text-lg">Existing Menu Items</h3>
              </div>
              {loading ? <p>Loading...</p> : (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                  <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
                      <tr>
                        <th className="p-4">Item</th>
                        <th className="p-4">Price</th>
                        <th className="p-4 text-center">Stock</th>
                        <th className="p-4">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {menuItems.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="p-4 font-bold text-sm text-gray-700">
                            {item.name}
                            <span className="text-gray-400 font-normal ml-2">({item.category})</span>
                          </td>
                          <td className="p-4">
                            <input
                              type="number"
                              defaultValue={item.price}
                              id={`price-${item.id}`}
                              className="w-20 p-2 border rounded bg-white font-mono"
                            />
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => toggleStock(item.id, item.available)}
                              className={`px-3 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                            >
                              {item.available ? 'In Stock' : 'Sold Out'}
                            </button>
                          </td>
                          <td className="p-4 flex gap-2">
                            <button
                              onClick={() => updatePrice(item.id, document.getElementById(`price-${item.id}`).value)}
                              className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"
                            >
                              <Save size={16} />
                            </button>
                            <button
                              onClick={() => deleteItem(item.id)}
                              className="bg-red-100 text-red-600 px-3 py-2 rounded text-xs font-bold"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}

          {activeAdminTab === 'orders' && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200">
                <h3 className="font-bold text-lg">Recent Orders</h3>
              </div>
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
                  <tr>
                    <th className="p-3">Time</th>
                    <th className="p-3">Phone</th>
                    <th className="p-3">Total (KES)</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Items</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {orders.length === 0 && (
                    <tr>
                      <td className="p-4 text-gray-400 text-center" colSpan={6}>No orders yet.</td>
                    </tr>
                  )}
                  {orders.map(order => (
                    <tr key={order.id} className="align-top">
                      <td className="p-3 text-xs text-gray-500">
                        {order.created_at ? new Date(order.created_at).toLocaleString() : ''}
                      </td>
                      <td className="p-3 font-mono text-xs">{order.phone}</td>
                      <td className="p-3 font-bold">{order.total}</td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${order.status === 'paid' ? 'bg-green-100 text-green-700' : order.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-xs text-gray-600 max-w-xs">
                        {Array.isArray(order.items) && order.items.map(i => (
                          <div key={i.id}>{i.qty} x {i.name}</div>
                        ))}
                      </td>
                      <td className="p-3 space-x-2">
                        <button
                          onClick={() => updateOrderStatus(order.id, 'paid')}
                          className="px-2 py-1 text-xs rounded bg-green-100 text-green-700 font-bold"
                        >
                          Mark Paid
                        </button>
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-2 py-1 text-xs rounded bg-red-100 text-red-700 font-bold"
                        >
                          Cancel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-10 py-4 text-center text-xs text-gray-400">
        <div className="flex items-center justify-center gap-3 mb-2">
          <a href="#" title="Instagram" aria-label="Instagram" className="text-gray-400 hover:text-orange-600 p-2 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.2"/>
              <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.2"/>
            </svg>
          </a>
          <a href="#" title="WhatsApp" aria-label="WhatsApp" className="text-gray-400 hover:text-orange-600 p-2 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 11.5a9.38 9.38 0 0 1-1.3 4.6l.9 3.3-3.4-.9A9.8 9.8 0 1 1 21 11.5z" stroke="currentColor" strokeWidth="1" fill="currentColor" />
            </svg>
          </a>
          <a href="#" title="Email" aria-label="Email" className="text-gray-400 hover:text-orange-600 p-2 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 6.5h18v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-11z" stroke="currentColor" strokeWidth="1"/>
              <path d="M21 6.5l-9 7-9-7" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
          <a href="#" title="TikTok" aria-label="TikTok" className="text-gray-400 hover:text-orange-600 p-2 rounded-md">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 8.5a4 4 0 0 1-4-4v7.8A4.2 4.2 0 1 0 16 8.5z" stroke="currentColor" strokeWidth="1"/>
              <path d="M8 21a6 6 0 0 0 8-5.8v-1.2" stroke="currentColor" strokeWidth="1"/>
            </svg>
          </a>
        </div>
        © {new Date().getFullYear()} Snack Have Hun Admin Panel. All rights reserved.
      </footer>
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