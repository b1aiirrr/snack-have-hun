import React, { useState } from 'react';
import { ShoppingCart, Plus, Minus, Search, X, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Analytics } from "@vercel/analytics/react";


// --- CUSTOM LOGO COMPONENT ---
const Logo = ({ className }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <div className="relative w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center shadow-lg transform rotate-3">
      <span className="text-white font-black text-xl italic tracking-tighter">SHH</span>
      <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
    </div>
  </div>
);

// --- FULL HD MENU DATA ---
const INITIAL_MENU = [
  {
    id: 'fries', 
    name: 'Fries & Chips', 
    icon: '🍟',
    hero: 'https://images.unsplash.com/photo-1630384060421-a4323ceca041?auto=format&fit=crop&w=1200&q=80',
    items: [
      { id: 101, name: 'Classic Fries', price: 100, desc: 'Golden, crispy potato sticks with a light salt touch.', img: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4054?auto=format&fit=crop&w=400&q=80' },
      { id: 102, name: 'Plain Chips', price: 100, desc: 'Thick-cut and home-style, perfect for dipping or pairing.', img: 'https://images.unsplash.com/photo-1612174390004-941da7383617?auto=format&fit=crop&w=400&q=80' },
      { id: 103, name: 'Masala Chips', price: 150, desc: 'Spicy, saucy, and bold—Nairobi’s favorite street-style snack.', img: 'https://images.unsplash.com/photo-1623238917800-47b637d7c664?auto=format&fit=crop&w=400&q=80' },
      { id: 104, name: 'Garlic Chips', price: 120, desc: 'Crispy chips tossed in aromatic garlic goodness.', img: 'https://images.unsplash.com/photo-1585109649139-3668018951a7?auto=format&fit=crop&w=400&q=80' },
      { id: 105, name: 'Paprika Chips', price: 120, desc: 'Smoky and vibrant with a paprika kick.', img: 'https://images.unsplash.com/photo-1541592103007-ceb5d81a3b74?auto=format&fit=crop&w=400&q=80' },
      { id: 106, name: 'Potato Sauté', price: 100, desc: 'Tender cubes sautéed with herbs and a hint of spice.', img: 'https://images.unsplash.com/photo-1593560704563-f176a2eb61db?auto=format&fit=crop&w=400&q=80' },
      { id: 107, name: 'Potato Wedges', price: 100, desc: 'Chunky, crispy edges with a soft, fluffy center.', img: 'https://images.unsplash.com/photo-1555198967-b72f44c4b63e?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'mains', 
    name: 'Main Course', 
    icon: '🍖',
    hero: 'https://images.unsplash.com/photo-1544025162-d76690b6d015?auto=format&fit=crop&w=1200&q=80',
    items: [
      // Pork
      { id: 201, name: 'Dry Fry Pork', price: 350, desc: 'Crispy, seasoned pork bites with a savory crunch.', img: 'https://images.unsplash.com/photo-1606728035753-172774b8dbc0?auto=format&fit=crop&w=400&q=80' },
      { id: 202, name: 'Wet Fry Pork', price: 350, desc: 'Juicy pork simmered in rich tomato and onion sauce.', img: 'https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?auto=format&fit=crop&w=400&q=80' },
      { id: 203, name: 'Honey Glazed Pork', price: 350, desc: 'Sweet and sticky with a caramelized finish.', img: 'https://images.unsplash.com/photo-1608755728617-aefab37d25e2?auto=format&fit=crop&w=400&q=80' },
      // Beef
      { id: 204, name: 'Dry Fry Beef', price: 300, desc: 'Spiced and seared to perfection—classic Kenyan comfort.', img: 'https://images.unsplash.com/photo-1603073163308-9654c3fb70b9?auto=format&fit=crop&w=400&q=80' },
      { id: 205, name: 'Wet Fry Beef', price: 300, desc: 'Tender beef in a flavorful stew, perfect with ugali.', img: 'https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=400&q=80' },
      // Chicken
      { id: 206, name: 'Dry Fry Chicken', price: 300, desc: 'Crispy chicken chunks with bold seasoning.', img: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=400&q=80' },
      { id: 207, name: 'Wet Fry Chicken', price: 300, desc: 'Juicy chicken simmered in savory sauce.', img: 'https://images.unsplash.com/photo-1562967914-608f82629710?auto=format&fit=crop&w=400&q=80' },
      { id: 208, name: 'Stir-Fried Wings', price: 300, desc: 'Tossed in herbs and spice—crispy and crave-worthy.', img: 'https://images.unsplash.com/photo-1569691899455-88464f6d3ab1?auto=format&fit=crop&w=400&q=80' },
      { id: 209, name: 'Honey Glazed Wings', price: 300, desc: 'Sweet, sticky, and finger-licking good.', img: 'https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=400&q=80' },
      // Sides
      { id: 210, name: 'Plain Rice', price: 100, desc: 'Soft, fluffy, and perfect for soaking up sauces.', img: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?auto=format&fit=crop&w=400&q=80' },
      { id: 211, name: 'Pilau', price: 150, desc: 'Aromatic spiced rice with a rich, savory depth.', img: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?auto=format&fit=crop&w=400&q=80' },
      { id: 212, name: 'Ugali', price: 50, desc: 'Kenya’s classic maize staple—firm, filling, and comforting.', img: 'https://images.unsplash.com/photo-1604569106263-54602f37a505?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'snacks', 
    name: 'Snacks & Bites', 
    icon: '🥟',
    hero: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1200&q=80',
    items: [
      { id: 301, name: 'Beef Samosa', price: 50, desc: 'Crispy triangle stuffed with spicy minced beef.', img: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80' },
      { id: 302, name: 'Chicken Samosa', price: 50, desc: 'Flaky pastry filled with tender chicken bits.', img: 'https://images.unsplash.com/photo-1610669931376-79c536551b81?auto=format&fit=crop&w=400&q=80' },
      { id: 303, name: 'Vegetable Samosa', price: 50, desc: 'Light and crunchy with a veggie-packed center.', img: 'https://images.unsplash.com/photo-1589301760576-41f473911295?auto=format&fit=crop&w=400&q=80' },
      { id: 304, name: 'Beef Spring Roll', price: 50, desc: 'Rolled and fried with savory beef filling.', img: 'https://images.unsplash.com/photo-1548559134-2e2129e34a7d?auto=format&fit=crop&w=400&q=80' },
      { id: 305, name: 'Chicken Spring Roll', price: 50, desc: 'Crispy shell with juicy chicken inside.', img: 'https://images.unsplash.com/photo-1606335192275-d280b395f269?auto=format&fit=crop&w=400&q=80' },
      { id: 306, name: 'Vegetable Spring Roll', price: 50, desc: 'Crunchy and fresh with seasoned veggies.', img: 'https://images.unsplash.com/photo-1544955355-6b83f0449d01?auto=format&fit=crop&w=400&q=80' },
      { id: 307, name: 'Meat Pies', price: 50, desc: 'Buttery crust with a hearty meat filling.', img: 'https://images.unsplash.com/photo-1621251717327-640a3407ce5d?auto=format&fit=crop&w=400&q=80' },
      { id: 308, name: 'Chicken Pies', price: 50, desc: 'Soft pastry packed with creamy chicken.', img: 'https://images.unsplash.com/photo-1608039773822-2e557620a811?auto=format&fit=crop&w=400&q=80' },
      { id: 309, name: 'Sausages', price: 50, desc: 'Juicy and grilled—perfect on the go.', img: 'https://images.unsplash.com/photo-1595908920188-6927dfd6771e?auto=format&fit=crop&w=400&q=80' },
      { id: 310, name: 'Smokies', price: 50, desc: 'Smoky, savory, and satisfying.', img: 'https://images.unsplash.com/photo-1574312675971-886d34b3f81e?auto=format&fit=crop&w=400&q=80' },
      { id: 311, name: 'Hot Dogs', price: 150, desc: 'Classic bun with sausage and toppings.', img: 'https://images.unsplash.com/photo-1612392062422-3ef1e6584d38?auto=format&fit=crop&w=400&q=80' },
      { id: 312, name: 'Burgers', price: 150, desc: 'Toasted bun, juicy patty, and fresh fixings.', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'drinks', 
    name: 'Beverages', 
    icon: '🥤',
    hero: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=1200&q=80',
    items: [
      { id: 401, name: 'Sodas', price: 80, desc: 'Fizzy and refreshing—choose your favorite.', img: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80' },
      { id: 402, name: 'Minute Maid', price: 100, desc: 'Fruity and sweet, served chilled.', img: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?auto=format&fit=crop&w=400&q=80' },
      { id: 403, name: 'Smoothies', price: 150, desc: 'Blended fresh with tropical fruits.', img: 'https://images.unsplash.com/photo-1610970881699-44a5587cabec?auto=format&fit=crop&w=400&q=80' },
      { id: 404, name: 'Milkshakes', price: 150, desc: 'Creamy, cool, and indulgent.', img: 'https://images.unsplash.com/photo-1577805947697-b984381e95e3?auto=format&fit=crop&w=400&q=80' },
      { id: 405, name: 'Water', price: 50, desc: 'Pure hydration, always chilled.', img: 'https://images.unsplash.com/photo-1564419434663-c49967363849?auto=format&fit=crop&w=400&q=80' },
    ]
  },
  {
    id: 'combos', 
    name: 'Signature Combos', 
    icon: '🌟',
    hero: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=1200&q=80',
    items: [
      { id: 501, name: 'The Hog Haven', price: 500, desc: 'Pork + Paprika Chips + Minute Maid/Water.', img: 'https://images.unsplash.com/photo-1625938145744-e38051541d1c?auto=format&fit=crop&w=400&q=80' },
      { id: 502, name: 'Canvas Crunch', price: 500, desc: 'Chicken/Wings + Masala Chips + Smoothie/Soda.', img: 'https://images.unsplash.com/photo-1585238342024-78d387f4a707?auto=format&fit=crop&w=400&q=80' },
      { id: 503, name: 'Retro Beef Fix', price: 500, desc: 'Dry Fry Beef + Garlic Chips + Milkshake/Water.', img: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&w=400&q=80' },
      { id: 504, name: 'The Haven Classic', price: 400, desc: 'Burger/Hot Dog + Classic Fries + Soda.', img: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d?auto=format&fit=crop&w=400&q=80' },
      { id: 505, name: 'Bites & Bliss', price: 400, desc: '2 Snacks + Small Fries + Smoothie/Milkshake.', img: 'https://images.unsplash.com/photo-1623653387945-2fd25214f8fc?auto=format&fit=crop&w=400&q=80' },
      { id: 506, name: 'Green Escape', price: 300, desc: 'Veg Samosa + Veg Spring Roll + Plain Chips + Smoothie.', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
      { id: 507, name: 'Little Haven Combo', price: 400, desc: 'Mini Burger/Hot Dog + Small Fries + Juice/Water.', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
      { id: 508, name: 'Family Feast', price: 1500, desc: '3 Mains + 3 Sides + 3 Drinks. A hearty spread.', img: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80' },
    ]
  }
];

// --- MAIN APP COMPONENT ---
export default function App() {
  const [activeCategory, setActiveCategory] = useState('fries');
  const [cart, setCart] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // --- CART LOGIC ---
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

  // --- DEMO MODE PAYMENT ---
  const handleMpesaPayment = () => {
    if (!phoneNumber) {
      alert("Please enter a phone number");
      return;
    }
    
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
      
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm border-b border-orange-100 px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Logo />
          <h1 className="font-bold text-xl hidden sm:block text-orange-950">Snack Have Hun</h1>
        </div>
        <div className="flex gap-3">
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
          style={{ backgroundImage: `url('${activeCatData?.hero}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
        <div className="relative z-10 px-6 py-6 w-full max-w-6xl mx-auto">
          <motion.div 
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <span className="bg-orange-600 text-xs font-bold px-2 py-1 rounded mb-2 inline-block uppercase tracking-wider">
              {activeCatData?.name}
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold shadow-black drop-shadow-md">
              Kenyan Street Food, Elevated.
            </h2>
          </motion.div>
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div className="sticky top-[65px] z-30 bg-orange-50/95 backdrop-blur py-4 border-b border-orange-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-3 overflow-x-auto no-scrollbar">
          {INITIAL_MENU.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-5 py-2 rounded-full whitespace-nowrap text-sm font-bold transition-all shadow-sm flex items-center gap-2 ${
                activeCategory === cat.id 
                ? 'bg-gray-900 text-white scale-105 ring-2 ring-orange-400' 
                : 'bg-white text-gray-600 hover:bg-orange-200 hover:text-orange-900'
              }`}
            >
              <span>{cat.icon}</span> {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* ITEMS GRID */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 border-l-4 border-orange-500 pl-4">
          {activeCatData?.name} Menu
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeCatData?.items.map((item) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl shadow-sm border border-orange-100 flex flex-col justify-between group hover:border-orange-300 hover:shadow-xl transition-all h-full overflow-hidden"
            >
              {/* ITEM IMAGE (Sub-Picture) */}
              <div className="h-48 overflow-hidden">
                <img 
                  src={item.img} 
                  alt={item.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>

              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-gray-900 leading-tight">{item.name}</h3>
                  <span className="bg-orange-100 text-orange-800 font-bold px-2 py-1 rounded text-sm whitespace-nowrap">
                    KES {item.price}
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-grow">{item.desc}</p>
                
                <button 
                  onClick={() => addToCart(item)}
                  className="w-full bg-gray-50 text-gray-700 py-3 rounded-lg font-bold flex items-center justify-center gap-2 group-hover:bg-orange-600 group-hover:text-white transition-all mt-auto"
                >
                  <Plus size={18} /> Add to Order
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CART MODAL */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} 
              onClick={() => setIsCartOpen(false)} 
              className="fixed inset-0 bg-black z-50" 
            />
            <motion.div 
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} 
              className="fixed right-0 top-0 bottom-0 w-full md:w-[400px] bg-white z-[60] shadow-2xl p-6 flex flex-col h-full"
            >
              <div className="flex justify-between items-center mb-6 border-b pb-4">
                <h2 className="text-2xl font-black text-gray-900">Your Order</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X className="text-gray-500" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 pr-2">
                {cart.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <ShoppingCart size={48} className="mb-2 opacity-20" />
                    <p>Cart is empty</p>
                  </div>
                ) : ( 
                  cart.map(item => (
                    <div key={item.id} className="flex justify-between items-center bg-orange-50 p-3 rounded-xl border border-orange-100">
                      <div>
                        <p className="font-bold text-gray-800">{item.name}</p>
                        <p className="text-xs text-gray-500">KES {item.price} x {item.qty}</p>
                      </div>
                      <div className="flex items-center gap-3 bg-white rounded-lg px-2 py-1 shadow-sm">
                        <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-red-500"><Minus size={16}/></button>
                        <span className="font-bold text-sm w-4 text-center">{item.qty}</span>
                        <button onClick={() => updateQty(item.id, 1)} className="text-green-600 hover:text-green-700"><Plus size={16}/></button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="border-t pt-6 mt-4">
                <div className="flex justify-between text-xl font-bold mb-4">
                  <span>Total</span>
                  <span className="text-orange-600">KES {cartTotal}</span>
                </div>
                
                <div className="space-y-3">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide">M-Pesa Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="e.g. 0712345678" 
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl p-4 font-mono text-lg focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                  />
                  <button 
                    onClick={handleMpesaPayment}
                    disabled={isProcessing || cartTotal === 0}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex justify-center items-center gap-2 ${
                      isProcessing 
                      ? 'bg-gray-400 text-white cursor-not-allowed' 
                      : 'bg-green-600 text-white hover:bg-green-700 shadow-green-200'
                    }`}
                  >
                    {isProcessing ? (
                      <span className="flex items-center gap-2">Processing...</span>
                    ) : (
                      <>Pay KES {cartTotal} <CheckCircle size={20} /></>
                    )}
                  </button>
                  <p className="text-center text-xs text-gray-400 mt-2">Secured by IntaSend</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}