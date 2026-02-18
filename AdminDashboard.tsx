
import React, { useState } from 'react';
import { Product, Category, StoreSettings, Story, MondayOffer } from '../types';
import { supabase, uploadImage } from '../lib/supabase';
import { 
  Plus, Edit2, Trash2, X, Save, Image as ImageIcon, 
  Lock, Loader2, Upload, Megaphone, Camera, Smartphone, Layout, Tag, Zap, Home, Eye, Heart, LogOut, Video
} from 'lucide-react';

interface AdminDashboardProps {
  products: Product[];
  stories: Story[];
  mondayOffers: MondayOffer[];
  onRefresh: () => void;
  onClose: () => void;
  settings: StoreSettings;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, stories, mondayOffers, onRefresh, onClose, settings }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('admin_auth') === 'true');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'products' | 'stories' | 'offers' | 'settings'>('home');
  
  const [isProductFormOpen, setIsProductFormOpen] = useState(false);
  const [isOfferFormOpen, setIsOfferFormOpen] = useState(false);
  const [isStoryFormOpen, setIsStoryFormOpen] = useState(false);
  
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingOffer, setEditingOffer] = useState<MondayOffer | null>(null);
  const [storeSettings, setStoreSettings] = useState<StoreSettings>(settings);

  const [productFormData, setProductFormData] = useState<Partial<Product>>({ 
    name: '', price: 0, weight: '', category: Category.Chicken, image: '', description: ''
  });

  const [offerFormData, setOfferFormData] = useState<Partial<MondayOffer>>({
    name: '', old_price: 0, new_price: 0, image: ''
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  const resetForms = () => {
    setEditingProduct(null);
    setEditingOffer(null);
    setProductFormData({ name: '', price: 0, weight: '', category: Category.Chicken, image: '', description: '' });
    setOfferFormData({ name: '', old_price: 0, new_price: 0, image: '' });
    setImageFile(null);
    setPreviewUrl('');
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'fkhradeen20029') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_auth', 'true');
    } else {
      alert('كلمة المرور غير صحيحة');
    }
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    localStorage.removeItem('admin_auth');
    localStorage.clear(); 
    setIsAuthenticated(false);
    onClose();
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productFormData.name || !productFormData.price) return alert('يرجى كتابة الاسم والسعر');
    setLoading(true);
    try {
      let finalImageUrl = productFormData.image || '';
      if (imageFile) finalImageUrl = await uploadImage(imageFile);
      
      if (!finalImageUrl) throw new Error('يرجى اختيار صورة للمنتج');

      const payload = { 
        name: productFormData.name,
        price: Number(productFormData.price),
        weight: productFormData.weight || '1 كيلو',
        category: productFormData.category || Category.Chicken,
        image: finalImageUrl,
        description: productFormData.description
      };

      const { error } = editingProduct 
        ? await supabase.from('products').update(payload).eq('id', editingProduct.id)
        : await supabase.from('products').insert([payload]);

      if (error) throw error;

      alert('تم حفظ المنتج بنجاح ✅');
      onRefresh();
      setIsProductFormOpen(false);
      resetForms();
    } catch (err: any) { 
      alert('خطأ في حفظ المنتج: ' + (err.message || 'فشل الاتصال'));
    } finally { setLoading(false); }
  };

  const handleOfferSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerFormData.name || !offerFormData.new_price) return alert('يرجى إدخال الاسم والسعر الجديد');
    setLoading(true);
    try {
      let finalImageUrl = offerFormData.image || '';
      if (imageFile) finalImageUrl = await uploadImage(imageFile);
      if (!finalImageUrl) throw new Error('يجب إرفاق صورة للعرض الذهبي');

      const payload = {
        name: offerFormData.name,
        old_price: Number(offerFormData.old_price || 0),
        new_price: Number(offerFormData.new_price),
        image: finalImageUrl
      };

      const { error } = editingOffer
        ? await supabase.from('monday_offers').update(payload).eq('id', editingOffer.id)
        : await supabase.from('monday_offers').insert([payload]);

      if (error) throw error;

      alert('تم رفع العرض الذهبي بنجاح! ✨');
      onRefresh();
      setIsOfferFormOpen(false);
      resetForms();
    } catch (err: any) { 
      alert('فشل الرفع: ' + err.message);
    } finally { setLoading(false); }
  };

  const handleStorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile) return alert('يرجى اختيار صورة أو فيديو للحالة');
    setLoading(true);
    try {
      const mediaUrl = await uploadImage(imageFile);
      const isVideo = imageFile.type.startsWith('video/');
      
      const { error } = await supabase.from('stories').insert([{ 
        image_url: mediaUrl,
        media_type: isVideo ? 'video' : 'image',
        views: 0,
        likes: 0
      }]);
      
      if (error) throw error;

      alert('تم نشر الحالة بنجاح 📸');
      onRefresh();
      setIsStoryFormOpen(false);
      resetForms();
    } catch (err: any) { 
      alert('خطأ في الحالة: ' + err.message);
    } finally { setLoading(false); }
  };

  const deleteItem = async (table: string, id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا العنصر نهائياً؟')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (error) throw error;
      
      alert('تم الحذف بنجاح ✅');
      onRefresh(); // تحديث القائمة بعد الحذف
    } catch (e: any) { 
      console.error('Delete error:', e);
      alert('فشل الحذف: قد تكون هناك قيود في قاعدة البيانات. يرجى مراجعة صلاحيات RLS.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#050A14] flex items-center justify-center p-4 font-tajawal">
        <div className="bg-[#0B192C] p-10 rounded-[3rem] shadow-2xl w-full max-w-md text-center border border-white/10">
          <Lock size={64} className="text-red-500 mx-auto mb-6" />
          <h2 className="text-3xl font-black mb-6 text-white">إدارة أساور</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <input 
              type="password" placeholder="كلمة المرور" 
              className="w-full p-5 bg-white rounded-2xl outline-none border-2 border-transparent focus:border-red-600 text-center text-gray-900 font-black text-2xl placeholder-gray-300 shadow-inner" 
              value={password} onChange={e => setPassword(e.target.value)} autoFocus 
            />
            <button type="submit" className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-red-500 transition-colors shadow-lg shadow-red-900/40 active:scale-95">دخول</button>
            <button type="button" onClick={onClose} className="text-white/20 mt-4 block w-full">العودة للمتجر</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-tajawal text-right text-gray-900" dir="rtl">
      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-[100] px-4 py-3 flex items-center justify-between shadow-md">
        <div className="flex items-center gap-4 overflow-x-auto no-scrollbar">
          <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black shrink-0">أ</div>
          <div className="flex gap-1 shrink-0">
            {[
              { id: 'home', label: 'الرئيسية', icon: <Home size={18}/> },
              { id: 'products', label: 'المنتجات', icon: <Layout size={18}/> },
              { id: 'offers', label: 'عروض الاثنين', icon: <Tag size={18}/> },
              { id: 'stories', label: 'الحالات', icon: <Smartphone size={18}/> },
              { id: 'settings', label: 'الأخبار', icon: <Megaphone size={18}/> },
            ].map(tab => (
              <button 
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)} 
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-red-600 text-white shadow-lg' : 'text-gray-400 hover:bg-gray-100'}`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2.5 bg-red-600 text-white rounded-xl font-black shadow-lg hover:bg-red-700 transition-all active:scale-95">
             <span className="hidden md:inline">خروج</span> <LogOut size={20}/>
          </button>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-red-600"><X size={28}/></button>
        </div>
      </nav>

      <div className="container mx-auto p-4 md:p-8">
        {loading && (
          <div className="fixed inset-0 z-[2000] bg-black/20 backdrop-blur-sm flex items-center justify-center">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-4">
              <Loader2 className="animate-spin text-red-600" />
              <span className="font-black">جاري معالجة الطلب...</span>
            </div>
          </div>
        )}

        {activeTab === 'home' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all">
                 <p className="text-gray-400 font-bold mb-1">المنتجات</p>
                 <h4 className="text-4xl font-black text-blue-600">{products.length}</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all">
                 <p className="text-gray-400 font-bold mb-1">المشاهدات</p>
                 <h4 className="text-4xl font-black text-green-600 flex items-center justify-center gap-2"><Eye size={24}/> {stories.reduce((acc, s) => acc + (s.views || 0), 0)}</h4>
              </div>
              <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 text-center group hover:shadow-lg transition-all">
                 <p className="text-gray-400 font-bold mb-1">الإعجابات</p>
                 <h4 className="text-4xl font-black text-red-600 flex items-center justify-center gap-2"><Heart size={24}/> {stories.reduce((acc, s) => acc + (s.likes || 0), 0)}</h4>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <button onClick={() => { resetForms(); setIsProductFormOpen(true); }} className="p-10 bg-blue-600 text-white rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-lg"><Plus size={32}/> إضافة منتج جديد</button>
               <button onClick={() => { resetForms(); setIsOfferFormOpen(true); }} className="p-10 bg-yellow-500 text-black rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-lg"><Zap size={32} fill="currentColor"/> إضافة عرض ذهبي</button>
               <button onClick={() => { resetForms(); setIsStoryFormOpen(true); }} className="p-10 bg-red-600 text-white rounded-[2.5rem] font-black text-xl flex flex-col items-center justify-center gap-4 hover:scale-105 transition-all shadow-xl shadow-red-200"><Camera size={32}/> رفع حالة (صورة/فيديو)</button>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="bg-white rounded-[2rem] shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
              <h3 className="text-xl font-black">قائمة المنتجات</h3>
              <button onClick={() => { resetForms(); setIsProductFormOpen(true); }} className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-md"><Plus size={18}/> منتج جديد</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-right">
                <thead>
                  <tr className="bg-gray-50 text-gray-400 text-xs font-black uppercase">
                    <th className="px-6 py-4">المنتج</th>
                    <th className="px-6 py-4">التصنيف</th>
                    <th className="px-6 py-4">السعر</th>
                    <th className="px-6 py-4 text-center">إجراءات</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map(p => (
                    <tr key={p.id} className="hover:bg-gray-50/50 group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover border" />
                        <span className="font-bold text-gray-800">{p.name}</span>
                      </td>
                      <td className="px-6 py-4 text-xs font-bold text-gray-400">{p.category}</td>
                      <td className="px-6 py-4 font-black text-red-600">{p.price.toLocaleString()} ج.س</td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex justify-center gap-2">
                          <button onClick={() => { setEditingProduct(p); setProductFormData(p); setPreviewUrl(p.image); setIsProductFormOpen(true); }} className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Edit2 size={18}/></button>
                          <button onClick={() => deleteItem('products', p.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {products.length === 0 && <p className="text-center py-20 text-gray-400 font-bold">لا توجد منتجات حالياً</p>}
            </div>
          </div>
        )}

        {activeTab === 'offers' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-yellow-600">عروض الاثنين الذهبية ✨</h3>
              <button onClick={() => { resetForms(); setIsOfferFormOpen(true); }} className="bg-yellow-500 text-black px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-md hover:scale-105 transition-all"><Plus size={18}/> إضافة عرض جديد</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {mondayOffers.map(o => (
                 <div key={o.id} className="bg-white p-5 rounded-[2.5rem] shadow-sm border-2 border-yellow-100 relative group overflow-hidden">
                    <div className="flex items-center gap-4">
                      <img src={o.image} className="w-20 h-20 rounded-xl object-cover border" />
                      <div className="flex-1">
                        <h4 className="font-black text-gray-800">{o.name}</h4>
                        <p className="text-gray-400 line-through text-xs">{o.old_price.toLocaleString()} ج.س</p>
                        <p className="text-yellow-600 font-black text-xl">{o.new_price.toLocaleString()} ج.س</p>
                      </div>
                    </div>
                    <div className="absolute top-2 left-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditingOffer(o); setOfferFormData(o); setPreviewUrl(o.image); setIsOfferFormOpen(true); }} className="p-2 bg-blue-50 text-blue-500 rounded-lg shadow-sm"><Edit2 size={14}/></button>
                      <button onClick={() => deleteItem('monday_offers', o.id)} className="p-2 bg-red-50 text-red-500 rounded-lg shadow-sm"><Trash2 size={14}/></button>
                    </div>
                 </div>
               ))}
               {mondayOffers.length === 0 && (
                  <div className="col-span-full bg-yellow-50 p-10 rounded-[2.5rem] border-2 border-dashed border-yellow-200 text-center">
                    <p className="text-yellow-700 font-black text-lg mb-2">لا توجد عروض نشطة حالياً</p>
                    <p className="text-yellow-600/60 text-sm">اضغط على زر الإضافة في الأعلى لبدء عروض الاثنين الذهبية</p>
                  </div>
               )}
            </div>
          </div>
        )}

        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-2xl font-black text-red-600">إدارة الحالات (صورة / فيديو)</h3>
              <button onClick={() => { resetForms(); setIsStoryFormOpen(true); }} className="bg-red-600 text-white px-6 py-3 rounded-xl font-black flex items-center gap-2 shadow-lg hover:scale-105 transition-all"><Camera size={18}/> رفع حالة جديدة</button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
               {stories.map(s => (
                 <div key={s.id} className="bg-white rounded-3xl shadow-sm border overflow-hidden group relative">
                    {s.media_type === 'video' ? (
                      <div className="w-full h-56 bg-black flex items-center justify-center text-white relative">
                        <Video size={48} className="opacity-20 animate-pulse"/>
                        <div className="absolute top-2 right-2 bg-red-600 px-2 py-1 rounded-md text-[10px] font-black shadow-lg">فيديو</div>
                      </div>
                    ) : (
                      <img src={s.image_url} className="w-full h-56 object-cover" />
                    )}
                    <div className="p-4 flex justify-between items-center bg-white border-t">
                      <div className="flex gap-3 text-[10px] font-black">
                        <span className="flex items-center gap-1 text-green-600"><Eye size={12}/> {s.views}</span>
                        <span className="flex items-center gap-1 text-red-600"><Heart size={12}/> {s.likes}</span>
                      </div>
                      <button onClick={() => deleteItem('stories', s.id)} className="p-2 text-red-400 hover:text-red-600 bg-red-50 rounded-lg"><Trash2 size={16}/></button>
                    </div>
                 </div>
               ))}
               {stories.length === 0 && <p className="col-span-full text-center py-20 text-gray-400 font-bold">لا توجد حالات مرفوعة حالياً</p>}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
           <div className="max-w-xl mx-auto bg-white p-10 rounded-[2.5rem] shadow-sm border space-y-6">
             <div className="flex items-center gap-3 text-red-600"><Megaphone size={32}/> <h3 className="text-2xl font-black">شريط الأخبار المتحرك</h3></div>
             <p className="text-gray-400 text-sm font-bold">هذا النص سيظهر في الشريط الأحمر أعلى الصفحة الرئيسية للمتجر.</p>
             <textarea 
               className="w-full p-6 bg-gray-50 rounded-2xl outline-none font-black border-2 border-transparent focus:border-red-600 min-h-[140px] text-gray-900 text-xl shadow-inner placeholder-gray-300"
               placeholder="اكتب هنا أخبار المتجر أو التهنئات..."
               value={storeSettings.news_ticker}
               onChange={e => setStoreSettings({...storeSettings, news_ticker: e.target.value})}
             />
             <button onClick={() => { setLoading(true); supabase.from('store_settings').upsert({ id: 1, ...storeSettings }).then(() => { setLoading(false); alert('تم حفظ الإعدادات بنجاح ✅'); onRefresh(); }); }} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 active:scale-95 transition-all">
               {loading ? <Loader2 className="animate-spin" /> : <Save size={24}/>} حفظ التعديلات
             </button>
           </div>
        )}
      </div>

      {/* --- MODALS --- */}
      {isProductFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden text-gray-900 animate-slide-up">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">{editingProduct ? 'تعديل بيانات المنتج' : 'إضافة منتج جديد للمتجر'}</h3>
              <button onClick={() => setIsProductFormOpen(false)} className="hover:rotate-90 transition-transform"><X/></button>
            </div>
            <form onSubmit={handleProductSubmit} className="p-8 space-y-5">
              <input type="text" placeholder="اسم المنتج" required className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 border-2 border-transparent focus:border-blue-600 outline-none shadow-sm text-lg" value={productFormData.name} onChange={e => setProductFormData({...productFormData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 mr-2">السعر (ج.س)</label>
                  <input type="number" placeholder="السعر" required className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 border-2 border-transparent focus:border-blue-600 outline-none shadow-sm" value={productFormData.price} onChange={e => setProductFormData({...productFormData, price: Number(e.target.value)})} />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-400 mr-2">الوزن / الكمية</label>
                  <input type="text" placeholder="مثال: 1 كيلو" required className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 border-2 border-transparent focus:border-blue-600 outline-none shadow-sm" value={productFormData.weight} onChange={e => setProductFormData({...productFormData, weight: e.target.value})} />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-400 mr-2">التصنيف</label>
                <select className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 border-2 border-transparent focus:border-blue-600 outline-none shadow-sm" value={productFormData.category} onChange={e => setProductFormData({...productFormData, category: e.target.value as Category})}>
                  {Object.values(Category).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div className="h-44 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-blue-400 transition-colors">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon size={48} className="text-gray-200 mx-auto" /><p className="text-xs text-gray-300 font-bold mt-2">اضغط لاختيار صورة المنتج</p></div>}
                <input type="file" id="p-img" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }} />
                <label htmlFor="p-img" className="absolute inset-0 cursor-pointer"></label>
              </div>
              <button disabled={loading} className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Save size={20}/>} {editingProduct ? 'حفظ التغييرات' : 'تأكيد ونشر المنتج'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isOfferFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-lg rounded-[2.5rem] shadow-2xl overflow-hidden text-gray-900 animate-slide-up">
            <div className="bg-yellow-500 p-6 text-black flex justify-between items-center">
              <h3 className="text-xl font-black">{editingOffer ? 'تعديل العرض الذهبي' : 'إضافة عرض ذهبي جديد'}</h3>
              <button onClick={() => setIsOfferFormOpen(false)}><X/></button>
            </div>
            <form onSubmit={handleOfferSubmit} className="p-8 space-y-4">
              <input type="text" placeholder="اسم المنتج في العرض" required className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-900 border-2 border-transparent focus:border-yellow-600 outline-none shadow-sm" value={offerFormData.name} onChange={e => setOfferFormData({...offerFormData, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="السعر قبل الخصم" required className="w-full p-4 bg-gray-50 rounded-xl font-black text-gray-400 border-2 border-transparent focus:border-yellow-600 outline-none line-through" value={offerFormData.old_price} onChange={e => setOfferFormData({...offerFormData, old_price: Number(e.target.value)})} />
                <input type="number" placeholder="السعر بعد الخصم" required className="w-full p-4 bg-yellow-50 rounded-xl font-black text-yellow-800 border-2 border-yellow-300 outline-none shadow-inner" value={offerFormData.new_price} onChange={e => setOfferFormData({...offerFormData, new_price: Number(e.target.value)})} />
              </div>
              <div className="h-40 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
                {previewUrl ? <img src={previewUrl} className="w-full h-full object-cover" /> : <div className="text-center"><ImageIcon size={48} className="text-gray-200 mx-auto" /><p className="text-xs text-gray-300 font-bold mt-2">صورة العرض</p></div>}
                <input type="file" id="o-img" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if(file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                }} />
                <label htmlFor="o-img" className="absolute inset-0 cursor-pointer"></label>
              </div>
              <button disabled={loading} className="w-full bg-yellow-500 text-black py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-2 shadow-xl shadow-yellow-900/20 active:scale-95 transition-all">
                {loading ? <Loader2 className="animate-spin" /> : <Zap size={20} fill="currentColor"/>} {editingOffer ? 'حفظ تعديل العرض' : 'تفعيل العرض الذهبي'}
              </button>
            </form>
          </div>
        </div>
      )}

      {isStoryFormOpen && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-white w-full max-w-sm rounded-[2.5rem] shadow-2xl overflow-hidden text-gray-900 animate-slide-up">
            <div className="bg-red-600 p-6 text-white flex justify-between items-center">
              <h3 className="text-xl font-black">رفع حالة (Story)</h3>
              <button onClick={() => setIsStoryFormOpen(false)}><X/></button>
            </div>
            <form onSubmit={handleStorySubmit} className="p-8 space-y-6">
               <div className="h-96 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group cursor-pointer">
                  {previewUrl ? (
                    imageFile?.type.startsWith('video/') ? (
                      <video src={previewUrl} className="w-full h-full object-cover" autoPlay muted loop />
                    ) : (
                      <img src={previewUrl} className="w-full h-full object-cover" />
                    )
                  ) : <div className="text-center"><Camera size={48} className="text-gray-200 mx-auto group-hover:text-red-300 transition-colors" /><p className="text-xs text-gray-300 mt-2 font-black">اختر صورة أو فيديو قصير من جهازك</p></div>}
                  <input type="file" id="s-img" accept="image/*,video/*" className="hidden" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if(file) { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); }
                  }} />
                  <label htmlFor="s-img" className="absolute inset-0 cursor-pointer"></label>
               </div>
               <button disabled={loading} className="w-full bg-red-600 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-xl shadow-red-900/40 active:scale-95 transition-all">
                  {loading ? <Loader2 className="animate-spin" /> : <Upload size={24}/>} نشر الحالة الآن
               </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
