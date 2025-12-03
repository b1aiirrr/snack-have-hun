import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";

// --- ROBUST IMAGE COMPONENT ---
// Keeps the UI clean even if an image is loading
const FoodImage = ({ src, alt }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="w-full h-full bg-gray-100 relative overflow-hidden">
      {/* Loading Skeleton */}
      {!isLoaded && !error && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
      
      {/* Fallback for Broken Images */}
      {error ? (
        <div className="flex items-center justify-center h-full bg-orange-50 text-orange-400">
          <span className="text-xs font-bold uppercase tracking-wider px-2 text-center">{alt}</span>
        </div>
      ) : (
        <img 
          src={src} 
          alt={alt} 
          className={`w-full h-full object-cover transition-all duration-700 hover:scale-110 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setIsLoaded(true)}
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

// --- PRECISE IMAGERY MENU DATA ---
const INITIAL_MENU = [
  {
    id: 'fries', 
    name: 'Fries & Chips', 
    icon: '🍟',
    // Hero: Big pile of golden fries
    hero: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?q=80&w=1200&auto=format&fit=crop',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden, crispy potato sticks with a light salt touch.', img: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?w=600&q=80' },
      { id: 102, name: 'Plain Chips', price: 100, desc: 'Thick-cut and home-style, perfect for dipping.', img: 'https://images.unsplash.com/photo-1612174390004-941da7383617?w=600&q=80' },
      { id: 103, name: 'Masala Chips', price: 150, desc: 'Spicy, saucy, and bold—Nairobi’s favorite.', img: 'https://images.unsplash.com/photo-1576570734281-a97920aa679c?w=600&q=80' }, // Saucy visual
      { id: 104, name: 'Garlic Chips', price: 120, desc: 'Crispy chips tossed in aromatic garlic butter.', img: 'https://images.unsplash.com/photo-1623238917800-47b637d7c664?w=600&q=80' },
      { id: 105, name: 'Paprika Chips', price: 120, desc: 'Smoky and vibrant with a paprika kick.', img: 'https://images.unsplash.com/photo-1541592103007-ceb5d81a3b74?w=600&q=80' },
      { id: 106, name: 'Potato Sauté', price: 100, desc: 'Tender cubes sautéed with herbs.', img: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?w=600&q=80' },
      { id: 107, name: 'Potato Wedges', price: 100, desc: 'Chunky, crispy edges with a soft center.', img: 'https://images.unsplash.com/photo-1555198967-b72f44c4b63e?w=600&q=80' },
    ]
  },
  {
    id: 'mains', 
    name: 'Main Course', 
    icon: '🍖',
    // Hero: Feast spread
    hero: 'https://images.unsplash.com/photo-1544025162-d76690b6d015?q=80&w=1200&auto=format&fit=crop',
    items: [
      // Pork (Dry = Roast image, Wet = Stew image)
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Crispy, seasoned pork bites with a savory crunch.', img: 'https://images.unsplash.com/photo-1606728035753-172774b8dbc0?w=600&q=80' }, 
      { id: 202, name: 'Wet Fry Pork', price: 350, desc: 'Juicy pork simmered in rich tomato and onion sauce.', img: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&q=80' }, 
      { id: 203, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet and sticky with a caramelized finish.', img: 'https://images.unsplash.com/photo-1608755728617-aefab37d25e2?w=600&q=80' },
      // Beef
      { id: 204, name: 'Dry Fry Beef', price: 300, desc: 'Spiced and seared to perfection.', img: 'https://images.unsplash.com/photo-1558030006-4506719b740a?w=600&q=80' },
      { id: 205, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef in a flavorful stew.', img: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?w=600&q=80' },
      // Chicken
      { id: 206, name: 'Dry Fry Chicken', price: 300, desc: 'Crispy chicken chunks with bold seasoning.', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=600&q=80' },
      { id: 207, name: 'Wet Fry Chicken', price: 300, desc: 'Juicy chicken simmered in savory sauce.', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=600&q=80' },
      { id: 208, name: 'Stir-Fried Wings', price: 300, desc: 'Tossed in herbs and spice—crispy and crave-worthy.', img: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?w=600&q=80' },
      { id: 209, name: 'Honey Glazed Wings', price: 300, desc: 'Sweet, sticky, and finger-licking good.', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&q=80' },
      // Sides (Ugali = White mound)
      { id: 210, name: 'Plain Rice', price: 100, desc: 'Soft, fluffy, and perfect for soaking up sauces.', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&q=80' },
      { id: 211, name: 'Pilau', price: 150, desc: 'Aromatic spiced rice with a rich, savory depth.', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=600&q=80' },
      { id: 212, name: 'Ugali', price: 50, desc: 'Kenya’s classic maize staple—firm, filling, and comforting.', img: 'https://images.unsplash.com/photo-1626508035297-00007798486f?w=600&q=80' }, 
    ]
  },
  {
    id: 'snacks', 
    name: 'Snacks & Bites', 
    icon: '🥟',
    // Hero: Samosa stack
    hero: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?q=80&w=1200&auto=format&fit=crop',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Crispy triangle stuffed with spicy minced beef.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80' },
      { id: 302, name: 'Chicken Samosa', price: 50, desc: 'Flaky pastry filled with tender chicken bits.', img: 'https://images.unsplash.com/photo-1626508035297-00007798486f?w=600&q=80' },
      { id: 303, name: 'Vegetable Samosa', price: 50, desc: 'Light and crunchy with a veggie-packed center.', img: 'https://images.unsplash.com/photo-1589301760576-41f473911295?w=600&q=80' },
      { id: 304, name: 'Beef Spring Roll', price: 50, desc: 'Rolled and fried with savory beef filling.', img: 'https://images.unsplash.com/photo-1548559134-2e2129e34a7d?w=600&q=80' },
      { id: 305, name: 'Chicken Spring Roll', price: 50, desc: 'Crispy shell with juicy chicken inside.', img: 'https://images.unsplash.com/photo-1606335192275-d280b395f269?w=600&q=80' },
      { id: 306, name: 'Vegetable Spring Roll', price: 50, desc: 'Crunchy and fresh with seasoned veggies.', img: 'https://images.unsplash.com/photo-1544955355-6b83f0449d01?w=600&q=80' },
      { id: 307, name: 'Meat Pies', price: 50, desc: 'Buttery crust with a hearty meat filling.', img: 'https://images.unsplash.com/photo-1621251717327-640a3407ce5d?w=600&q=80' },
      { id: 308, name: 'Chicken Pies', price: 50, desc: 'Soft pastry packed with creamy chicken.', img: 'https://images.unsplash.com/photo-1608039773822-2e557620a811?w=600&q=80' },
      { id: 309, name: 'Sausages', price: 50, desc: 'Juicy and grilled—perfect on the go.', img: 'https://images.unsplash.com/photo-1595908920188-6927dfd6771e?w=600&q=80' },
      { id: 310, name: 'Smokies', price: 50, desc: 'Smoky, savory, and satisfying.', img: 'https://images.unsplash.com/photo-1574312675971-886d34b3f81e?w=600&q=80' },
      { id: 311, name: 'Hot Dogs', price: 150, desc: 'Classic bun with sausage and toppings.', img: 'https://images.unsplash.com/photo-1612392062422-3ef1e6584d38?w=600&q=80' },
      { id: 312, name: 'Burgers', price: 150, desc: 'Toasted bun, juicy patty, and fresh fixings.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80' },
    ]
  },
  {
    id: 'drinks', 
    name: 'Beverages', 
    icon: '🥤',
    hero: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?q=80&w=1200&auto=format&fit=crop',
    items: [
      { id: 401, name: 'Sodas', price: 80, desc: 'Fizzy and refreshing—choose your favorite.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&q=80' },
      { id: 402, name: 'Minute Maid', price: 100, desc: 'Fruity and sweet, served chilled.', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=600&q=80' },
      { id: 403, name: 'Smoothies', price: 150, desc: 'Blended fresh with tropical fruits.', img: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=600&q=80' },
      { id: 404, name: 'Milkshakes', price: 150, desc: 'Creamy, cool, and indulgent.', img: 'https://images.unsplash.com/photo-1577805947697-b984381e95e3?w=600&q=80' },
      { id: 405, name: 'Water', price: 50, desc: 'Pure hydration, always chilled.', img: 'https://images.unsplash.com/photo-1564419434663-c49967363849?w=600&q=80' },
    ]
  },
  {
    id: 'combos', 
    name: 'Signature Combos', 
    icon: '🌟',
    hero: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?q=80&w=1200&auto=format&fit=crop',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Drink.', img: 'https://images.unsplash.com/photo-1625938145744-e38051541d1c?w=600&q=80' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken + Masala Chips + Drink.', img: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?w=600&q=80' },
      { id: 503, name: 'Retro Beef Fix', price: 500, desc: 'Beef + Garlic Chips + Drink.', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?w=600&q=80' },
      { id: 504, name: 'The Haven Classic', price: 400, desc: 'Burger + Fries + Drink.', img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?w=600&q=80' },
      { id: 505, name: 'Bites & Bliss', price: 400, desc: '2 Snacks + Fries + Drink.', img: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?w=600&q=80' },
      { id: 506, name: 'Green Escape', price: 300, desc: 'Veg Snacks + Chips + Drink.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80' },
      { id: 507, name: 'Little Haven Combo', price: 400, desc: 'Mini Meal + Drink.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80' },
      { id: 508, name: 'Family Feast', price: 1500, desc: '3 Mains + Sides + Drinks.', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80' },
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
    }, 2500); 
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

      {/* REBUILT HERO SECTION */}
      <div className="relative h-[400px] text-white flex items-end overflow-hidden shadow-2xl">
        <div className="absolute inset-0 bg-cover bg-center transition-all duration-1000 transform scale-105" style={{ backgroundImage: `url('${activeCatData?.hero}')` }}></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
        <div className="relative z-10 px-6 py-12 w-full max-w-6xl mx-auto">
          <motion.div key={activeCategory} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-orange-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">Featured</span>
              <span className="text-orange-300 text-sm font-semibold tracking-wide uppercase">{activeCatData?.name}</span>
            </div>
            <h2 className="text-5xl md:text-6xl font-extrabold shadow-black drop-shadow-xl leading-tight mb-4">
              Kenyan Street Food,<br/> <span className="text-orange-500">Elevated.</span>
            </h2>
            <button onClick={() => document.getElementById('menu-grid').scrollIntoView({ behavior: 'smooth' })} className="bg-white text-orange-900 px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 hover:bg-orange-100 transition-colors">
              Explore Menu <ChevronRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>

      <div className="sticky top-[65px] z-30 bg-orange-50/95 backdrop-blur-md py-4 border-b border-orange-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {INITIAL_MENU.map(cat => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`px-5 py-2.5 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${activeCategory === cat.id ? 'bg-gray-900 text-white scale-105 ring-2 ring-orange-400 shadow-lg' : 'bg-white text-gray-600 hover:bg-orange-200 hover:text-orange-900'}`}>
              <span className="text-lg">{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div id="menu-grid" className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex items-center gap-3 mb-8 border-l-4 border-orange-500 pl-4">
          <h3 className="text-3xl font-bold text-gray-900">{activeCatData?.name}</h3>
          <span className="text-gray-400 text-sm font-medium hidden sm:inline-block">/ {activeCatData?.items.length} Items</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activeCatData?.items.map((item) => (
            <motion.div key={item.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl shadow-sm border border-orange-100 flex flex-col justify-between h-full overflow-hidden group hover:shadow-xl hover:border-orange-300 transition-all duration-300">
              <div className="h-56 overflow-hidden bg-gray-100 relative">
                <FoodImage src={item.img} alt={item.name} />
                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-orange-800 shadow-sm">
                  KES {item.price}
                </div>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="mb-3">
                  <h3 className="font-bold text-xl text-gray-900 leading-tight mb-1">{item.name}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{item.desc}</p>
                </div>
                <button onClick={() => addToCart(item)} className="w-full bg-orange-50 text-orange-700 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white transition-all mt-auto shadow-sm">
                  <Plus size={18} /> Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-black z-50 backdrop-blur-sm" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl flex flex-col h-full">
              <div className="p-6 bg-orange-50 border-b border-orange-100 flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
                  <p className="text-xs text-gray-500 mt-1">{cart.reduce((a,b) => a + b.qty, 0)} items selected</p>
                </div>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-white rounded-full transition-colors shadow-sm"><X className="text-gray-500" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400 space-y-4">
                    <div className="w-20 h-20 bg-orange-50 rounded-full flex items-center justify-center"><ShoppingCart size={40} className="opacity-20" /></div>
                    <p className="font-medium">Your cart is empty</p>
                    <button onClick={() => setIsCartOpen(false)} className="text-orange-600 text-sm font-bold hover:underline">Browse Menu</button>
                  </div>
                ) : cart.map(item => (
                  <div key={item.id} className="flex gap-4 items-center bg-white p-3 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
                      <p className="text-xs text-orange-600 font-bold mt-1">KES {item.price * item.qty}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg px-2 py-1">
                      <button onClick={() => updateQty(item.id, -1)} className="p-1 hover:text-red-500"><Minus size={14}/></button>
                      <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="p-1 hover:text-green-600"><Plus size={14}/></button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 bg-white border-t border-gray-100 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
                <div className="flex justify-between text-xl font-bold mb-6 text-gray-900"><span>Total</span><span className="text-orange-600">KES {cartTotal}</span></div>
                <div className="space-y-3">
                  <input type="tel" placeholder="M-Pesa Number (e.g. 0712...)" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 font-mono text-sm outline-none focus:ring-2 focus:ring-orange-500 transition-all" />
                  <button onClick={handleMpesaPayment} disabled={isProcessing || cartTotal === 0} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold text-lg shadow-xl hover:bg-black transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                    {isProcessing ? 'Processing...' : <>Pay Now <CheckCircle size={20} /></>}
                  </button>
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