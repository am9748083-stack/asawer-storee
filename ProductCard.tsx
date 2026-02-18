
import React, { useState } from 'react';
import { Product } from '../types';
import { Plus, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onRate: (id: string, rating: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onRate }) => {
  const currentRating = product.rating || 5;

  return (
    <div className="flex-shrink-0 w-48 md:w-60 glass rounded-[2rem] overflow-hidden group transition-all duration-500 hover:border-red-500/50 cursor-pointer animate-slide-in-right">
      <div className="relative h-40 md:h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B192C]/90 to-transparent" />
        <div className="absolute top-3 right-3">
           <span className="bg-red-600 text-white font-black text-[9px] px-3 py-1 rounded-full shadow-lg shadow-red-600/20">
            {product.category}
          </span>
        </div>
      </div>

      <div className="p-4 md:p-5 flex flex-col h-40 md:h-44 justify-between">
        <div className="space-y-1">
          <h3 className="font-black text-sm md:text-lg text-white leading-tight group-hover:text-red-400 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="text-white/40 text-[10px] md:text-xs font-bold">
            {product.weight}
          </p>

          <div className="flex items-center gap-1.5 pt-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star 
                  key={star}
                  size={12} 
                  className={`${
                    star <= currentRating ? 'text-red-500 fill-current' : 'text-white/10'
                  }`} 
                />
              ))}
            </div>
            <span className="text-[10px] font-bold text-white/20">({product.rating_count || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-white/5">
          <div className="flex flex-col">
             <span className="text-red-500 font-black text-lg md:text-2xl tracking-tighter">
              {product.price.toLocaleString()}
            </span>
            <span className="text-[9px] font-bold text-white/30 mr-0.5">ج.س</span>
          </div>
          
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart(product);
            }}
            className="bg-white/5 hover:bg-red-600 text-white w-10 h-10 md:w-12 md:h-12 rounded-2xl transition-all border border-white/10 active:scale-90 flex items-center justify-center"
          >
            <Plus size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
