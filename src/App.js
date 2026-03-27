import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, ChevronRight, Phone } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from './supabaseClient';

// --- MENU DATA ---
const MENU_DATA = [
  {
    id: 'fries', name: 'Fries & Chips', icon: '🍟',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden and crispy, salted to perfection.' },
      { id: 102, name: 'Masala Chips', price: 150, desc: 'Tossed in our signature spicy tomato masala sauce.' },
      { id: 103, name: 'Garlic Chips', price: 120, desc: 'Richly coated in roasted garlic butter.' },
      { id: 104, name: 'Paprika Chips', price: 120, desc: 'Light dusting of premium smoked paprika.' },
      { id: 105, name: 'Potato Wedges', price: 100, desc: 'Thick cut wedges with a seasoned crunch.' },
    ]
  },
  {
    id: 'mains', name: 'Main Course', icon: '🍖',
    items: [
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Succulent pork bites pan-fried with onions & dhania.' },
      { id: 202, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet, savory, and sticky honey goodness.' },
      { id: 203, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef cubes in a rich tomato gravy.' },
      { id: 204, name: 'Honey Glazed Wings', price: 300, desc: 'Crispy chicken wings tossed in spicy honey.' },
      { id: 205, name: 'Pilau', price: 150, desc: 'Authentic swahili spiced rice (Side).' },
    ]
  },
  {
    id: 'snacks', name: 'Snacks & Bites', icon: '🥟',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Crispy pastry filled with spiced minced beef.' },
      { id: 302, name: 'Chicken Spring Roll', price: 50, desc: 'Golden fried roll with seasoned chicken & veg.' },
      { id: 303, name: 'Smokies', price: 50, desc: 'The absolute Kenyan classic street sausage.' },
      { id: 304, name: 'Burger', price: 150, desc: 'Handcrafted classic beef patty with fresh lettuce.' },
    ]
  },
  {
    id: 'drinks', name: 'Beverages', icon: '🥤',
    items: [
      { id: 401, name: 'Soda (300ml)', price: 80, desc: 'Cold & Refreshing classic sodas.' },
      { id: 402, name: 'Milkshake', price: 150, desc: 'Thick Strawberry, Vanilla, or Chocolate shake.' },
      { id: 403, name: 'Minute Maid', price: 100, desc: 'Chilled premium fruit juice.' },
    ]
  },
  {
    id: 'combos', name: 'Signature Combos', icon: '🌟',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Any Soda combo.' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Wings + Masala Chips + Any Soda combo.' },
      { id: 503, name: 'Family Feast', price: 1500, desc: '3 Mains + 3 Sides + 3 Drinks of your choice.' },
    ]
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [notification, setNotification] = useState(null);
  
  // Checkout states
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Add to Cart Logic
  const addToCart = (item) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...item, qty: 1 }];
    });
    showNotification(`Added ${item.name} to your tray!`);
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
    setTimeout(() => setNotification(null), 3000);
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

  // M-PESA CHECKOUT
  async function handleCheckout() {
    if(!phoneNumber || phoneNumber.length < 9) {
      showNotification("Please enter a valid M-Pesa number");
      return;
    }
    
    // Formatting phone number to 254... format
    let formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
    if (formattedPhone.startsWith('0')) formattedPhone = '254' + formattedPhone.substring(1);
    else if (formattedPhone.startsWith('7') || formattedPhone.startsWith('1')) formattedPhone = '254' + formattedPhone;

    setIsCheckingOut(true);

    try {
      // 1. Send Order to Supabase (Pending)
      const orderData = {
        customer_name: formattedPhone,
        total_price: cartTotal || 0,
        status: 'Pending',
        items: cart || []
      };

      const { data: orderResponse, error: orderError } = await supabase
        .from('orders')
        .insert([orderData])
        .select();

      // 2. Trigger M-Pesa STK Push via Serverless Function
      const response = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: formattedPhone,
          amount: cartTotal
        })
      });

      const paymentData = await response.json();

      if(paymentData.success) {
        showNotification("Wait for the M-Pesa prompt on your phone! \uD83D\uDCF1");
        setTimeout(() => {
            setCart([]);
            setIsCartOpen(false);
            setPhoneNumber('');
        }, 1500);
      } else {
        alert("Failed to initiate M-Pesa checkout: " + (paymentData.error || "Unknown Error"));
      }
    } catch(err) {
      alert("Checkout Error: " + err.message);
    } finally {
      setIsCheckingOut(false);
    }
  }

  // ANIMATION VARIANTS
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } }
  };
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  return (
    <div className="min-h-screen bg-[#fcf9f6] text-gray-800 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* HEADER / NAV - Glassmorphism */}
      <nav className="fixed w-full top-0 z-40 glass border-b border-orange-100/50 px-6 py-4 flex justify-between items-center transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-orange-500 to-amber-600 p-2.5 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/30 tracking-tighter">
            SHH
          </div>
          <h1 className="font-extrabold text-2xl hidden sm:block text-transparent bg-clip-text bg-gradient-to-r from-orange-950 to-orange-700 tracking-tight">
            SnackHaveHun
          </h1>
        </div>
        
        <div className="flex gap-4 items-center">
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-white hover:bg-orange-50 rounded-full shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <ShoppingCart className="text-orange-900 group-hover:scale-110 transition-transform" size={22} />
            {cart.length > 0 && (
              <motion.span 
                initial={{ scale: 0 }} animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-orange-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full shadow-md"
              >
                {cart.reduce((a,b) => a + b.qty, 0)}
              </motion.span>
            )}
          </button>
        </div>
      </nav>

      {/* DYNAMIC HERO SECTION */}
      <div className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 bg-[#fcf9f6]">
          <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-orange-400/20 blur-[100px] mix-blend-multiply"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-amber-300/20 blur-[120px] mix-blend-multiply"></div>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-12">
            <motion.div 
                className="flex-1 text-center md:text-left z-10"
                initial="hidden" animate="visible" variants={staggerContainer}
            >
                <motion.span variants={fadeUp} className="inline-block py-1.5 px-4 rounded-full bg-orange-100 text-orange-700 font-bold text-sm mb-6 shadow-sm border border-orange-200">
                    \uD83C\uDF1F Satisfy Your Cravings
                </motion.span>
                <motion.h2 variants={fadeUp} className="text-5xl md:text-7xl font-black mb-6 text-gray-900 leading-[1.1] tracking-tight">
                    Premium Street Food, <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Elevated.</span>
                </motion.h2>
                <motion.p variants={fadeUp} className="text-gray-600 text-lg md:text-xl mb-10 max-w-lg mx-auto md:mx-0 font-medium">
                    From spicy Masala Chips to tender Honey Glazed Pork. Experience the authentic taste of Kenya with a premium twist.
                </motion.p>
                <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <button onClick={() => document.getElementById('menu').scrollIntoView()} className="bg-gray-900 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 flex items-center justify-center gap-2 group">
                        Explore Menu <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                    </button>
                </motion.div>
            </motion.div>
            <motion.div 
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }} animate={{ opacity: 1, scale: 1, rotate: 0 }} transition={{ duration: 0.8 }}
                className="flex-1 relative w-full max-w-md md:max-w-none"
            >
                {/* Decorative image container */}
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-orange-900/10 aspect-square md:aspect-[4/3] transform hover:rotate-2 transition-transform duration-500">
                    <img src="https://images.unsplash.com/photo-1541592103007-ceb5d81a3b74?auto=format&fit=crop&q=80" alt="Delicious street food" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white text-left">
                        <p className="font-bold text-xl">Masala Chips</p>
                        <p className="opacity-90 font-medium">Best Seller \uD83D\uDD25</p>
                    </div>
                </div>
            </motion.div>
        </div>
      </div>

      {/* MENU SECTION */}
      <div id="menu" className="max-w-6xl mx-auto px-6 py-12 md:py-24">
        
        {/* Search & Filter Header */}
        <div className="flex flex-col lg:flex-row gap-6 justify-between items-center mb-12">
          {/* Categories Pill Navigation */}
          <div className="flex gap-3 overflow-x-auto pb-4 w-full lg:w-auto no-scrollbar snap-x">
            {MENU_DATA.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex-shrink-0 snap-center px-6 py-3 rounded-2xl whitespace-nowrap text-base font-bold transition-all duration-300 flex items-center gap-2 ${
                  activeCategory === cat.id 
                  ? 'bg-gradient-to-br from-orange-500 to-amber-600 text-white shadow-lg shadow-orange-500/30' 
                  : 'bg-white text-gray-600 hover:bg-orange-50 hover:text-orange-600 shadow-sm border border-orange-100/50'
                }`}
              >
                <span className="text-xl">{cat.icon}</span> {cat.name}
              </button>
            ))}
          </div>
          
          {/* Search Input */}
          <div className="relative w-full lg:w-80 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-orange-500 transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Search your cravings..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white border-2 border-transparent focus:border-orange-500/30 shadow-sm focus:shadow-md outline-none transition-all font-medium text-gray-800 placeholder-gray-400"
            />
          </div>
        </div>

        {/* MENU GRID */}
        <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={staggerContainer} initial="hidden" animate="visible"
            key={activeCategory + searchTerm} // re-trigger animations on change
        >
          {MENU_DATA
            .find(c => c.id === activeCategory)
            .items
            .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((item) => (
              <motion.div 
                key={item.id}
                variants={fadeUp}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="bg-white rounded-3xl p-6 shadow-sm border border-orange-50/50 hover:shadow-2xl hover:shadow-orange-900/5 hover:border-orange-200 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-extrabold text-xl text-gray-900 leading-tight pr-4">{item.name}</h3>
                    <span className="bg-orange-50 text-orange-700 font-black px-3 py-1.5 rounded-xl text-sm whitespace-nowrap">
                      KES {item.price}
                    </span>
                  </div>
                  <p className="text-base text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
                <div className="mt-8">
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-full flex justify-center items-center gap-2 bg-gray-50 text-gray-900 border border-gray-100 px-4 py-3.5 rounded-xl text-md font-bold hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-colors group"
                  >
                    <Plus size={18} className="text-orange-500 group-hover:text-white transition-colors" /> Add to Tray
                  </button>
                </div>
              </motion.div>
          ))}
        </motion.div>

        {MENU_DATA.find(c => c.id === activeCategory).items.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
            <div className="text-center py-20 text-gray-400">
                <p className="text-xl font-bold">Nothing found for "{searchTerm}"</p>
                <p className="mt-2">Try searching something else entirely!</p>
            </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="bg-white border-t border-orange-100 mt-12 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-500 font-medium">
            <p>&copy; {new Date().getFullYear()} SnackHaveHun. All cravings satisfied.</p>
        </div>
      </footer>

      {/* CART OVERLAY & SIDEBAR */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50"
            />
            <motion.div 
              initial={{ x: '100%', opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', damping: 25, stiffness: 200 }} 
              exit={{ x: '100%', opacity: 0 }}
              className="fixed right-0 top-0 bottom-0 w-full md:w-[450px] bg-white z-50 shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100 bg-white sticky top-0 z-10">
                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Your Tray</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-full transition-colors">
                    <X className="text-gray-400" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {cart.length === 0 ? (
                  <div className="text-center text-gray-400 mt-32 flex flex-col items-center">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                        <ShoppingCart size={40} className="text-gray-300" />
                    </div>
                    <p className="text-xl font-bold text-gray-500">Your tray is empty!</p>
                    <p className="text-sm mt-2">Add some delicious snacks to get started.</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} 
                        key={item.id} 
                        className="flex justify-between items-center bg-white border border-gray-100 p-4 rounded-2xl shadow-sm"
                    >
                      <div className="flex-1 pr-4">
                        <p className="font-bold text-gray-900 text-lg">{item.name}</p>
                        <p className="text-orange-600 font-bold mt-1">KES {item.price * item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-gray-50 p-1.5 rounded-xl border border-gray-100">
                        <button onClick={() => updateQty(item.id, -1)} className="p-2 text-gray-500 hover:text-red-500 hover:bg-white rounded-lg transition-colors shadow-sm"><Minus size={14}/></button>
                        <span className="text-base font-bold w-6 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="p-2 text-orange-600 hover:text-orange-700 hover:bg-white rounded-lg transition-colors shadow-sm"><Plus size={14}/></button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                  <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)]">
                    <div className="flex justify-between text-lg font-bold mb-6 text-gray-600">
                      <span>Subtotal</span>
                      <span className="text-gray-900 text-2xl">KES {cartTotal}</span>
                    </div>
                    
                    {/* Phone Number Input for M-Pesa */}
                    <div className="mb-6">
                        <label className="block text-sm font-bold text-gray-700 mb-2">M-Pesa Number</label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-600 transition-colors" size={20} />
                            <input 
                                type="tel" 
                                placeholder="07XX..." 
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-green-500/30 focus:bg-white shadow-sm outline-none transition-all font-bold text-gray-900 placeholder-gray-400 text-lg"
                            />
                        </div>
                    </div>

                    <button 
                        disabled={isCheckingOut}
                        onClick={handleCheckout}
                        className={`w-full py-4 rounded-2xl font-black text-lg transition-all flex justify-center items-center gap-3 ${
                            isCheckingOut 
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                            : 'bg-[#46a049] text-white hover:bg-[#3d8c40] shadow-xl shadow-green-900/20'
                        }`} 
                    >
                      {isCheckingOut ? (
                          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, ease: "linear", duration: 1 }} className="w-6 h-6 border-4 border-gray-400 border-t-white rounded-full"/>
                      ) : (
                          <>Pay via M-Pesa <CheckCircle size={22} /></>
                      )}
                    </button>
                  </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* NOTIFICATION TOAST */}
      <AnimatePresence>
        {notification && (
          <motion.div 
            initial={{ y: 50, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.9 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 glass-dark text-white px-6 py-4 rounded-2xl z-50 text-sm font-bold flex items-center gap-3 shadow-2xl"
          >
            <CheckCircle className="text-orange-400" size={20} />
            {notification}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}