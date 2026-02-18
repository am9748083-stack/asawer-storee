
import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, 
  onClose, 
  items, 
  onUpdateQuantity, 
  onRemove,
  onCheckout 
}) => {
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      
      {/* Drawer Content */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col animate-slide-left">
        <div className="p-4 border-b flex items-center justify-between bg-asawer-red text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={24} />
            <h2 className="text-xl font-bold">سلة المشتريات</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <ShoppingBag size={64} className="mb-4 opacity-20" />
              <p className="text-lg">السلة فارغة حالياً</p>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 p-3 bg-gray-50 rounded-xl border border-gray-100">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-asawer-red font-medium">{(item.price * item.quantity).toLocaleString()} ج.س</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-white border rounded-lg px-2 py-1">
                      <button 
                        onClick={() => onUpdateQuantity(item.id, -1)}
                        className="text-gray-500 hover:text-asawer-red"
                      >
                        <Minus size={18} />
                      </button>
                      <span className="font-bold w-4 text-center">{item.quantity}</span>
                      <button 
                        onClick={() => onUpdateQuantity(item.id, 1)}
                        className="text-gray-500 hover:text-asawer-red"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-600">المجموع الفرعي</span>
              <span className="font-bold text-xl">{subtotal.toLocaleString()} ج.س</span>
            </div>
            <button 
              onClick={onCheckout}
              className="w-full bg-asawer-red hover:bg-red-900 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-colors"
            >
              إتمام الطلب
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartDrawer;
