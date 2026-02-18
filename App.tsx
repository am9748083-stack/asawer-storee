
import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCart, Phone, MapPin, Truck, Search, Settings, Loader2, Bell, MessageCircle, Moon, Star as StarIcon, Zap } from 'lucide-react';
import Splash from './components/Splash';
import DhikrPopup from './components/DhikrPopup';
import StoriesBar from './components/StoriesBar';
import StoryViewer from './components/StoryViewer';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import CartDrawer from './components/CartDrawer';
import CheckoutModal from './components/CheckoutModal';
import AdminDashboard from './components/AdminDashboard';
import MondayOfferCard from './components/MondayOfferCard';
import WhatsAppModal from './components/WhatsAppModal';
import { supabase } from './lib/supabase';
import { 
  SHOP_NAME, 
  WHATSAPP_NUMBER, 
  SHOP_LOCATION, 
  DELIVERY_INFO 
} from './constants';
import { Product, CartItem, Category, StoreSettings, Story, MondayOffer } from './types';

const App: React.FC = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [showDhikr, setShowDhikr] = useState(false);
  const [view, setView] = useState<'shop' | 'admin'>('shop');
  const [products, setProducts] = useState<Product[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [mondayOffers, setMondayOffers] = useState<MondayOffer[]>([]);
  const [activeStoryIndex, setActiveStoryIndex] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [settings, setSettings] = useState<StoreSettings>({
    news_ticker: 'مبارك عليكم الشهر.. متجر أساور يتمنى لكم صياماً مقبولاً وإفطاراً شهياً',
    monday_offer: 'عروض رمضان: خصم ذهبي كل يوم اثنين!',
    monday_offer_active: true
  });
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // جلب المنتجات
      const prodRes = await supabase.from('products').select('*').order('created_at', { ascending: false });
      if (prodRes.data) setProducts(prodRes.data);
      
      // جلب الحالات
      const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const storyRes = await supabase
        .from('stories')
        .select('*')
        .gt('created_at', twentyFourHoursAgo)
        .order('created_at', { ascending: false });
      if (storyRes.data) setStories(storyRes.data);

      // جلب عروض الاثنين - التعامل مع الخطأ إذا كان الجدول غير موجود
      const offerRes = await supabase.from('monday_offers').select('*').order('created_at', { ascending: false });
      if (offerRes.data) setMondayOffers(offerRes.data);
      else if (offerRes.error) console.warn("Notice: monday_offers table might be missing. Go to Admin -> Offers to see instructions.");

      // جلب الإعدادات
      const settsRes = await supabase.from('store_settings').select('*').single();
      if (settsRes.data) setSettings(settsRes.data);
    } catch (e) {
      console.error("Critical Fetch Error:", e);
    } finally {
      setLoading(false);
    }
  };

  const filteredProductsByCategory = useMemo(() => {
    const grouped: Record<string, Product[]> = {};
    products.forEach(p => {
      if (p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.includes(searchQuery)) {
        if (!grouped[p.category]) grouped[p.category] = [];
        grouped[p.category].push(p);
      }
    });
    return grouped;
  }, [searchQuery, products]);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const handleRate = async (productId: string, newRate: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    const oldRating = product.rating || 5;
    const oldCount = product.rating_count || 0;
    const updatedRating = ((oldRating * oldCount) + newRate) / (oldCount + 1);
    const updatedCount = oldCount + 1;
    try {
      await supabase.from('products').update({ rating: updatedRating, rating_count: updatedCount }).eq('id', productId);
      setProducts(prev => prev.map(p => p.id === productId ? { ...p, rating: updatedRating, rating_count: updatedCount } : p));
    } catch (e) { console.error(e); }
  };

  const handleSplashComplete = () => {
    setShowSplash(false);
    setShowDhikr(true);
  };

  if (showSplash) return <Splash onComplete={handleSplashComplete} />;

  if (view === 'admin') {
    return <AdminDashboard mondayOffers={mondayOffers} stories={stories} products={products} onRefresh={fetchData} settings={settings} onClose={() => setView('shop')} />;
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 font-tajawal overflow-x-hidden bg-[#050A14] text-white">
      {showDhikr && <DhikrPopup onClose={() => setShowDhikr(false)} />}
      {activeStoryIndex !== null && <StoryViewer stories={stories} initialIndex={activeStoryIndex} onClose={() => setActiveStoryIndex(null)} />}
      <WhatsAppModal isOpen={isWhatsAppModalOpen} onClose={() => setIsWhatsAppModalOpen(false)} />

      <div className="bg-red-600 text-white py-2 overflow-hidden whitespace-nowrap relative z-50 shadow-lg shadow-red-900/20">
        <div className="animate-marquee inline-block px-4 font-black text-xs md:text-sm uppercase tracking-wide">
          🌙 {settings.news_ticker} &nbsp;&nbsp;&nbsp;&nbsp; ✨ {settings.news_ticker} &nbsp;&nbsp;&nbsp;&nbsp; 🌙 {settings.news_ticker}
        </div>
      </div>

      <header className="sticky top-0 z-40 bg-[#0B192C]/90 backdrop-blur-lg border-b border-white/5 shadow-2xl">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center p-1 overflow-hidden border border-red-500/20">
                <img src="assets/logo.png" className="w-full h-full object-contain" onError={(e) => (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/asawer-logo/100/100'} />
             </div>
             <div>
               <h1 className="text-xl font-black tracking-tight text-white">{SHOP_NAME}</h1>
               <p className="text-[10px] text-red-400 font-bold">رمضان كريم</p>
             </div>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <button onClick={() => setIsWhatsAppModalOpen(true)} className="p-2.5 bg-green-600/10 text-green-500 rounded-xl hover:bg-green-600 hover:text-white transition-all border border-green-500/20">
              <MessageCircle size={20} />
            </button>
            <button onClick={() => setView('admin')} className="p-2.5 bg-white/5 rounded-xl text-white/40 hover:text-red-400 transition-colors">
              <Settings size={20} />
            </button>
            <button onClick={() => setIsCartOpen(true)} className="relative p-2.5 bg-red-600 text-white rounded-xl shadow-lg shadow-red-900/40 hover:scale-105 transition-all">
              <ShoppingCart size={22} />
              {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-white text-red-600 font-black text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#0B192C]">{cart.length}</span>}
            </button>
          </div>
        </div>
      </header>

      <StoriesBar stories={stories} onStoryClick={(idx) => setActiveStoryIndex(idx)} />

      <section className="relative h-[250px] md:h-[350px] flex flex-col items-center justify-center text-center px-4 mt-8">
        <div className="absolute top-0 right-10 text-red-500/5 floating-lantern hidden md:block">
          <Moon size={200} strokeWidth={0.5} className="fill-current" />
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex justify-center gap-2">
            <StarIcon size={16} className="text-red-500 fill-current animate-pulse" />
            <StarIcon size={24} className="text-red-500 fill-current animate-pulse [animation-delay:0.3s]" />
            <StarIcon size={16} className="text-red-500 fill-current animate-pulse" />
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-white">جودة نثق بها وطعم يميّزنا</h2>
          <p className="text-xs md:text-base font-medium text-white/40 uppercase tracking-[0.4em]">أساور | التكينة</p>
        </div>

        <div className="container mx-auto max-w-lg px-4 relative z-20 w-full translate-y-12">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-0.5 flex items-center border border-white/10 focus-within:border-red-500/40 transition-all">
            <div className="p-4 text-red-400">
              <Search size={22} />
            </div>
            <input 
              type="text" placeholder="ماذا نحضر لسفرة إفطاركم اليوم؟" 
              className="flex-1 px-2 py-5 outline-none text-white font-bold text-base bg-transparent placeholder:text-white/20"
              value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* عروض الاثنين الذهبية */}
      {mondayOffers.length > 0 && (
        <section className="py-20 mt-12 bg-gradient-to-r from-yellow-500/5 to-transparent border-y border-white/5">
          <div className="container mx-auto px-4 flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-500 rounded-2xl shadow-lg shadow-yellow-500/20">
                <Zap size={28} className="text-black fill-current" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-yellow-500">عروض الاثنين الذهبية ✨</h3>
                <p className="text-[10px] text-yellow-400/60 font-bold uppercase tracking-widest">أقوى التخفيضات الأسبوعية</p>
              </div>
            </div>
          </div>
          
          <div className="flex overflow-x-auto gap-8 px-4 pb-4 no-scrollbar snap-x">
            {mondayOffers.map(offer => (
              <MondayOfferCard key={offer.id} offer={offer} />
            ))}
          </div>
        </section>
      )}

      <main className="py-16 space-y-24">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin mb-4 text-red-500" size={40} />
            <p className="font-bold text-sm text-white/30">جاري تحضير القائمة الرمضانية...</p>
          </div>
        ) : (
          Object.values(Category).map(category => (
            filteredProductsByCategory[category]?.length > 0 && 
            <section key={category} className="fade-in">
              <div className="container mx-auto px-4 flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-1.5 h-10 bg-red-600 rounded-full shadow-[0_0_15px_rgba(239,68,68,0.3)]"></div>
                  <h3 className="text-3xl font-black text-white">{category}</h3>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                  <StarIcon size={12} className="text-red-400 fill-current" />
                  <span className="text-[11px] text-white/40 font-bold">{filteredProductsByCategory[category].length} صنف</span>
                </div>
              </div>
              
              <div className="flex overflow-x-auto gap-6 px-4 pb-8 no-scrollbar snap-x touch-pan-x">
                {filteredProductsByCategory[category].map(product => (
                  <div key={product.id} className="snap-start" onClick={() => setSelectedProduct(product)}>
                    <ProductCard product={product} onAddToCart={addToCart} onRate={handleRate} />
                  </div>
                ))}
              </div>
            </section>
          ))
        )}
      </main>

      <footer className="bg-[#050A14] border-t border-white/5 py-20">
        <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <Truck size={48} className="text-red-500 mx-auto mb-6" />
              <h4 className="text-xl font-black mb-3 text-white">توصيل سريع</h4>
              <p className="text-white/40 text-xs leading-relaxed">{DELIVERY_INFO}</p>
            </div>
            <div className="p-10 bg-red-600 text-white rounded-[3rem] shadow-2xl shadow-red-900/20 relative overflow-hidden group">
              <Moon size={120} className="absolute -bottom-6 -left-6 opacity-10" />
              <MapPin size={48} className="mx-auto mb-6" />
              <h4 className="text-xl font-black mb-3">موقعنا</h4>
              <p className="font-bold text-xs leading-relaxed">{SHOP_LOCATION}</p>
            </div>
            <div className="p-10 bg-white/5 rounded-[3rem] border border-white/10">
              <Phone size={48} className="text-red-500 mx-auto mb-6" />
              <h4 className="text-xl font-black mb-3 text-white">تواصل معنا</h4>
              <div className="flex gap-3 mt-6">
                <a href={`tel:${WHATSAPP_NUMBER}`} className="flex-1 bg-white/10 p-4 rounded-2xl font-black text-sm text-white hover:bg-white/20 transition-all">اتصال</a>
                <a href={`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}`} className="flex-1 bg-green-600 p-4 rounded-2xl font-black text-sm text-white hover:bg-green-700 transition-all">واتساب</a>
              </div>
            </div>
        </div>
        <div className="text-center mt-16">
           <p className="text-white/10 text-[11px] font-black uppercase tracking-[0.5em]">أساور • التكينة • رمضان ١٤٤٦ هـ</p>
        </div>
      </footer>

      <ProductModal 
        product={selectedProduct} 
        onClose={() => setSelectedProduct(null)} 
        onAddToCart={addToCart} 
        onRate={handleRate}
      />
      
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cart} onUpdateQuantity={(id, d) => setCart(c => c.map(i => i.id === id ? {...i, quantity: Math.max(1, i.quantity + d)} : i))} onRemove={id => setCart(c => c.filter(i => i.id !== id))} onCheckout={() => {setIsCartOpen(false); setIsCheckoutOpen(true);}} />
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} onSubmit={(data) => {
          const productList = cart.map(i => `✅ ${i.name} [${i.weight}]\n   الكمية: ${i.quantity}\n   السعر: ${(i.price * i.quantity).toLocaleString()} ج.س`).join('\n\n');
          const total = cart.reduce((s, i) => s + (i.price * i.quantity), 0);
          const message = `*طلب جديد من متجر أساور*\n\n👤 *العميل:* ${data.name}\n📞 *الهاتف:* ${data.phone}\n📍 *العنوان:* ${data.address}\n\n📦 *المنتجات:*\n${productList}\n\n💰 *الإجمالي النهائي: ${total.toLocaleString()} ج.س*\n\nشكراً لاختياركم أساور! 🌙✨`;
          window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${encodeURIComponent(message)}`);
        }} 
      />
    </div>
  );
};

export default App;
