
import React from 'react';
// Fixed: Using MondayOffer as the underlying data structure is identical and ThursdayOffer is not exported from types.ts
import { MondayOffer } from '../types';
import { Tag, Zap } from 'lucide-react';

interface ThursdayOfferCardProps {
  offer: MondayOffer;
}

const ThursdayOfferCard: React.FC<ThursdayOfferCardProps> = ({ offer }) => {
  const discountPercentage = Math.round(((offer.old_price - offer.new_price) / offer.old_price) * 100);

  return (
    <div className="flex-shrink-0 w-72 bg-gradient-to-br from-red-600 to-red-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-white/10 snap-center">
      {/* Discount Badge */}
      <div className="absolute top-4 left-4 z-20 bg-white text-red-600 font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1 animate-pulse">
        <Zap size={14} fill="currentColor" />
        <span className="text-sm">خصم {discountPercentage}%</span>
      </div>

      <div className="h-44 relative">
        <img src={offer.image} alt={offer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-white/60">
          <Tag size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">عرض الخميس الخاص</span>
        </div>
        
        <h3 className="text-xl font-black text-white leading-tight">{offer.name}</h3>
        
        <div className="flex items-end justify-between pt-2 border-t border-white/10">
          <div className="flex flex-col">
            <span className="text-white/40 text-xs font-bold line-through">{offer.old_price.toLocaleString()} ج.س</span>
            <span className="text-2xl font-black text-white">{offer.new_price.toLocaleString()} <span className="text-[10px] opacity-60">ج.س</span></span>
          </div>
          <div className="bg-white/10 p-3 rounded-2xl text-white">
            <Zap size={20} className="fill-current" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ThursdayOfferCard;
