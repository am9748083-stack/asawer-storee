
import React, { useState } from 'react';
import { Product } from '../types';
import { X, ShoppingCart, Star, Info, CheckCircle } from 'lucide-react';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onRate: (id: string, rating: number) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart, onRate }) => {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [rated, setRated] = useState(false);

  if (!product) return null;

  const currentRating = Math.round(product.rating || 5);

  const handleRatingClick = (star: number) => {
    onRate(product.id, star);
    setRated(true);
    setTimeout(() => setRated(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity" 
        onClick={onClose} 
      />
      
      <div className="relative w-full max-w-lg bg-[#0B192C]/90 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden animate-slide-up">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-red-500 hover:text-white rounded-full text-white transition-all"
        >
          <X size={24} />
        </button>

        <div className="relative h-64 md:h-80 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C] via-transparent to-transparent" />
          <div className="absolute bottom-6 right-6">
            <span className="bg-red-600 text-white px-4 py-1 rounded-full font-black text-xs shadow-lg">
              {product.category}
            </span>
          </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-3xl font-black text-white mb-2 leading-tight">
                {product.name}
              </h2>
              
              {/* Interactive Rating Area */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      onClick={() => handleRatingClick(star)}
                      className="transition-transform active:scale-125 hover:scale-110"
                    >
                      <Star 
                        size={18} 
                        className={`${
                          star <= (hoveredStar || currentRating) ? 'text-red-500 fill-current' : 'text-white/10'
                        } transition-colors`} 
                      />
                    </button>
                  ))}
                </div>
                {rated ? (
                  <span className="text-green-500 text-xs font-bold flex items-center gap-1 animate-fade-in">
                    <CheckCircle size={14} /> تم التقييم
                  </span>
                ) : (
                  <span className="text-white/40 text-xs font-bold">({product.rating_count || 0} تقييم)</span>
                )}
              </div>
            </div>
            
            <div className="text-left">
              <span className="text-3xl font-black text-red-500">
                {product.price.toLocaleString()}
              </span>
              <span className="text-sm text-white/40 block font-bold">ج.س / {product.weight}</span>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="text-red-400 font-bold flex items-center gap-2 text-sm uppercase tracking-widest">
              <Info size={16} /> وصف المنتج
            </h4>
            <p className="text-white/70 leading-relaxed font-medium">
              {product.description || "لحوم طازجة مختارة بعناية فائقة من مزارعنا، نضمن لك الجودة والمذاق الأصيل لكل قطعة في سفرة رمضان."}
            </p>
          </div>

          <button 
            onClick={() => {
              onAddToCart(product);
              onClose();
            }}
            className="w-full bg-red-600 hover:bg-red-500 text-white py-5 rounded-2xl font-black text-xl shadow-xl shadow-red-900/20 flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <ShoppingCart size={24} />
            أضف إلى السلة
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
