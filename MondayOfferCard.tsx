
import React from 'react';
import { MondayOffer } from '../types';
import { Tag, Zap } from 'lucide-react';

interface MondayOfferCardProps {
  offer: MondayOffer;
}

const MondayOfferCard: React.FC<MondayOfferCardProps> = ({ offer }) => {
  const discountPercentage = Math.round(((offer.old_price - offer.new_price) / offer.old_price) * 100);

  return (
    <div className="flex-shrink-0 w-72 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-600 rounded-[2.5rem] overflow-hidden shadow-2xl relative group border border-white/20 snap-center">
      {/* Discount Badge */}
      <div className="absolute top-4 left-4 z-20 bg-black text-yellow-400 font-black px-4 py-2 rounded-2xl shadow-xl flex items-center gap-1 animate-pulse">
        <Zap size={14} fill="currentColor" />
        <span className="text-sm">خصم {discountPercentage}%</span>
      </div>

      <div className="h-44 relative">
        <img src={offer.image} alt={offer.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>

      <div className="p-6 space-y-4">
        <div className="flex items-center gap-2 text-black/60">
          <Tag size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest">عرض الاثنين الذهبي</span>
        </div>
        
        <h3 className="text-xl font-black text-black leading-tight">{offer.name}</h3>
        
        <div className="flex items-end justify-between pt-2 border-t border-black/10">
          <div className="flex flex-col">
            <span className="text-black/40 text-xs font-bold line-through">{offer.old_price.toLocaleString()} ج.س</span>
            <span className="text-2xl font-black text-black">{offer.new_price.toLocaleString()} <span className="text-[10px] opacity-60">ج.س</span></span>
          </div>
          <div className="bg-black/10 p-3 rounded-2xl text-black">
            <Zap size={20} className="fill-current text-yellow-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MondayOfferCard;
