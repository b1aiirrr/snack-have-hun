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
  <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-lg transform -rotate-3 border-2 border-white">
    <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
  </div>
);

// --- CONFIGURATION MAPPINGS ---
const HERO_IMAGES = {
  fries: '/food/hero_fries.jpg',
  mains: '/food/hero_mains.jpg',
  snacks: '/food/hero_snacks.jpg',
  drinks: '/food/hero_drinks.jpg',
  combos: '/food/hero_combos.jpg'
};

const CATEGORY_TITLES = {
  fries: 'Fries & Chips',
  mains: 'Main Course', // <--- FIXED HERE
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

// --- STATIC FALLBACK MENU ---
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
  {
    id: 'mains', name: 'Main Course', icon: '🍖', hero: '/food/hero_mains.jpg',
    items: [
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Crispy seasoned pork bites.', img: '/food/pork_dry.jpg', available: true },
      { id: 202, name: 'Wet Fry Pork', price: 350, desc: 'Juicy pork in tomato gravy.', img: '/food/pork_wet.jpg', available: true },
      { id: 203, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet sticky pork.', img: '/food/pork_honey.jpg', available: true },
      { id: 204, name: 'Dry Fry Beef', price: 300, desc: 'Spiced seared beef.', img: '/food/beef_dry.jpg', available: true },
      { id: 205, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef stew.', img: '/food/beef_wet.jpg', available: true },
      { id: 206, name: 'Dry Fry Chicken', price: 300, desc: 'Crispy seasoned chicken.', img: '/food/chicken_dry.jpg', available: true },
      { id: 207, name: 'Wet Fry Chicken', price: 300, desc: 'Chicken in savory sauce.', img: '/food/chicken_wet.jpg', available: true },
      { id: 208, name: 'Stir-Fried Wings', price: 300, desc: 'Herb tossed crispy wings.', img: '/food/wings_stirfry.jpg', available: true },
      { id: 209, name: 'Honey Glazed Wings', price: 300, desc: 'Sweet and sticky.', img: '/food/wings_honey.jpg', available: true },
      { id: 210, name: 'Plain Rice', price: 100, desc: 'Soft steamed rice.', img: '/food/rice.jpg', available: true },
      { id: 211, name: 'Pilau', price: 150, desc: 'Aromatic spiced rice.', img: '/food/pilau.jpg', available: true },
      { id: 212, name: 'Ugali', price: 50, desc: 'Classic maize staple.', img: '/food/ugali.jpg', available: true },
    ]
  },
  {
    id: 'snacks', name: 'Snacks & Bites', icon: '🥟', hero: '/food/hero_snacks.jpg',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Spiced beef triangle.', img: '/food/samosa_beef.jpg', available: true },
      { id: 302, name: 'Chicken Samosa', price: 50, desc: 'Chicken filled pastry.', img: '/food/samosa_chicken.jpg', available: true },
      { id: 303, name: 'Vegetable Samosa', price: 50, desc: 'Veggie filled crunch.', img: '/food/samosa_veg.jpg', available: true },
      { id: 304, name: 'Beef Spring Roll', price: 50, desc: 'Rolled and fried savory beef.', img: '/food/roll_beef.jpg', available: true },
      { id: 305, name: 'Chicken Spring Roll', price: 50, desc: 'Juicy chicken roll.', img: '/food/roll_chicken.jpg', available: true },
      { id: 306, name: 'Vegetable Spring Roll', price: 50, desc: 'Seasoned veggie roll.', img: '/food/roll_veg.jpg', available: true },
      { id: 307, name: 'Meat Pies', price: 50, desc: 'Buttery crust meat filling.', img: '/food/pie_meat.jpg', available: true },
      { id: 308, name: 'Chicken Pies', price: 50, desc: 'Creamy chicken pastry.', img: '/food/pie_chicken.jpg', available: true },
      { id: 309, name: 'Sausages', price: 50, desc: 'Juicy grilled sausage.', img: '/food/sausage.jpg', available: true },
      { id: 310, name: 'Smokies', price: 50, desc: 'Smoked sausage.', img: '/food/smokie.jpg', available: true },
      { id: 311, name: 'Hot Dogs', price: 150, desc: 'Classic bun & sausage.', img: '/food/hotdog.jpg', available: true },
      { id: 312, name: 'Burgers', price: 150, desc: 'Toasted bun, juicy patty.', img: '/food/burger.jpg', available: true },
    ]
  },
  {
    id: 'drinks', name: 'Beverages', icon: '🥤', hero: '/food/hero_drinks.jpg',
    items: [
      { id: 401, name: 'Sodas', price: 80, desc: 'Fizzy and refreshing.', img: '/food/soda.jpg', available: true },
      { id: 402, name: 'Minute Maid', price: 100, desc: 'Fruity and sweet.', img: '/food/juice.jpg', available: true },
      { id: 403, name: 'Smoothies', price: 150, desc: 'Blended fresh fruits.', img: '/food/smoothie.jpg', available: true },
      { id: 404, name: 'Milkshakes', price: 150, desc: 'Creamy and cool.', img: '/food/milkshake.jpg', available: true },
      { id: 405, name: 'Water', price: 50, desc: 'Pure chilled hydration.', img: '/food/water.jpg', available: true },
    ]
  },
  {
    id: 'combos', name: 'Signature Combos', icon: '🌟', hero: '/food/hero_combos.jpg',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Chips + Drink.', img: '/food/combo_hog.jpg', available: true },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken + Chips + Drink.', img: '/food/combo_chicken.jpg', available: true },
      { id: 503, name: 'Retro Beef Fix', price: 500, desc: 'Beef + Chips + Drink.', img: '/food/combo_beef.jpg', available: true },
      { id: 504, name: 'The Haven Classic', price: 400, desc: 'Burger + Fries + Drink.', img: '/food/combo_burger.jpg', available: true },
      { id: 505, name: 'Bites & Bliss', price: 400, desc: '2 Snacks + Fries + Drink.', img: '/food/combo_bites.jpg', available: true },
      { id: 506, name: 'Green Escape', price: 300, desc: 'Veg Snacks + Chips + Drink.', img: '/food/combo_veg.jpg', available: true },
      { id: 507, name: 'Little Haven Combo', price: 400, desc: 'Mini Meal + Drink.', img: '/food/combo_kids.jpg', available: true },
      { id: 508, name: 'Family Feast', price: 1500, desc: '3 Mains + Sides + Drinks.', img: '/food/combo_family.jpg', available: true },
    ]
  }
];

// --- 1. CUSTOMER MENU ---
const CustomerMenu = () => {
  const [menu, setMenu] = useState(INITIAL_MENU);
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // FETCH DATA
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (error) console.error('Error fetching menu:', error);
      else if (data && data.length > 0) {
        const categories = ['fries', 'mains', 'snacks', 'drinks', 'combos'];
        const grouped = categories.map(cat => ({
          id: cat,
          name: CATEGORY_TITLES[cat], // <--- CORRECT TITLE LOGIC
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
  const activeCatData = menu.find(c => c.id === activeCategory);

  const handlePayment = () => {
    if(!phoneNumber) return alert('Enter phone number');
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      alert(`✅ Order Received! KES ${cartTotal} paid via M-Pesa.`);
      setCart([]); setIsCartOpen(false);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-orange-50 font-sans text-gray-800 pb-20">
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2"><Logo /><h1 className="font-extrabold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1></div>
        <div className="flex gap-3">
          {/* Admin Link accessible only via /admin URL */}
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
                <button onClick={handlePayment} disabled={isProcessing} className="w-full bg-black text-white py-4 rounded-xl font-bold">{isProcessing ? 'Processing...' : 'Pay Now'}</button>
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

  // FETCH RAW DATA FROM DB
  useEffect(() => {
    const loadData = async () => {
      const { data, error } = await supabase.from('menu_items').select('*').order('id');
      if (!error) {
        setMenuItems(data);
        setLoading(false);
      }
    };
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '2024') setIsAuthenticated(true);
    else alert('Wrong PIN');
  };

  const updatePrice = async (id, newPrice) => {
    const { error } = await supabase.from('menu_items').update({ price: newPrice }).eq('id', id);
    if (!error) {
      alert('Price Updated!');
    } else {
      alert('Error updating price');
    }
  };

  const toggleStock = async (id, currentStatus) => {
    const { error } = await supabase.from('menu_items').update({ available: !currentStatus }).eq('id', id);
    if (!error) {
      setMenuItems(prev => prev.map(i => i.id === id ? { ...i, available: !currentStatus } : i));
    }
  };

  if (!isAuthenticated) {
    return (
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
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-30 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-3"><Logo /><h2 className="font-bold text-gray-900">Admin Dashboard</h2></div>
        <button onClick={() => setIsAuthenticated(false)} className="text-sm font-bold text-red-600 bg-red-50 px-4 py-2 rounded-lg">Log Out</button>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {loading ? <p>Loading items...</p> : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 text-xs text-gray-500 uppercase">
                <tr><th className="p-4">Item</th><th className="p-4">Price</th><th className="p-4 text-center">Stock</th><th className="p-4">Action</th></tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {menuItems.map(item => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-4 font-bold text-sm text-gray-700">{item.name} <span className="text-gray-400 font-normal ml-2">({item.category})</span></td>
                    <td className="p-4">
                      <input type="number" defaultValue={item.price} id={`price-${item.id}`} className="w-20 p-2 border rounded bg-white font-mono" />
                    </td>
                    <td className="p-4 text-center">
                      <button onClick={() => toggleStock(item.id, item.available)} className={`px-3 py-1 rounded-full text-xs font-bold ${item.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {item.available ? 'In Stock' : 'Sold Out'}
                      </button>
                    </td>
                    <td className="p-4">
                      <button onClick={() => updatePrice(item.id, document.getElementById(`price-${item.id}`).value)} className="bg-black text-white p-2 rounded hover:bg-gray-800 transition"><Save size={16}/></button>
                    </td>
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