
import React, { useState } from 'react';
import { CheckoutData } from '../types';
import { X, Phone, User, MapPin, CheckCircle } from 'lucide-react';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CheckoutData) => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState<CheckoutData>({
    name: '',
    phone: '',
    address: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.phone && formData.address) {
      onSubmit(formData);
    } else {
      alert('الرجاء تعبئة كافة الحقول المطلوبة');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-fade-in">
        <div className="bg-asawer-red p-6 text-white text-center">
          <CheckCircle size={48} className="mx-auto mb-2 opacity-90" />
          <h2 className="text-2xl font-bold">بيانات التوصيل</h2>
          <p className="text-white/80">يرجى إدخال بياناتك لتصلك منتجاتنا</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <User size={16} /> الاسم الكامل
            </label>
            <input 
              type="text" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-asawer-red focus:border-transparent outline-none transition-all"
              placeholder="أدخل اسمك الكريم"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <Phone size={16} /> رقم الهاتف
            </label>
            <input 
              type="tel" 
              required
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-asawer-red focus:border-transparent outline-none transition-all"
              placeholder="0123456789"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
              <MapPin size={16} /> العنوان بالتفصيل
            </label>
            <textarea 
              required
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-asawer-red focus:border-transparent outline-none transition-all resize-none"
              placeholder="الحي، المعالم المميزة في التكينة"
              value={formData.address}
              onChange={e => setFormData({ ...formData, address: e.target.value })}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-all"
            >
              إلغاء
            </button>
            <button 
              type="submit"
              className="flex-[2] py-3 rounded-xl bg-green-600 text-white font-bold shadow-lg hover:bg-green-700 transition-all active:scale-95"
            >
              إرسال عبر واتساب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
