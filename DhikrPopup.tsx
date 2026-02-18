
import React, { useMemo } from 'react';
import { Star, Moon, Heart } from 'lucide-react';

interface DhikrPopupProps {
  onClose: () => void;
}

const DhikrPopup: React.FC<DhikrPopupProps> = ({ onClose }) => {
  const dhikrs = [
    "لا إله إلا الله وحده لا شريك له",
    "الحمد لله حمداً كثيراً طيباً مباركاً فيه",
    "الله أكبر كبيراً والحمد لله كثيراً",
    "سبحان الله وبحمده، سبحان الله العظيم",
    "اللهم صلِّ وسلم وبارك على نبينا محمد",
    "لاحول ولا قوة إلا بالله العلي العظيم",
    "أستغفر الله العظيم وأتوب إليه",
    "سبحان الله وبحمده عدد خلقه ورضا نفسه",
    "اللهم إنك عفو كريم تحب العفو فاعفُ عنا",
    "يا حي يا قيوم برحمتك أستغيث"
  ];

  // اختيار ذكر عشوائي عند التحميل
  const randomDhikr = useMemo(() => {
    return dhikrs[Math.floor(Math.random() * dhikrs.length)];
  }, []);

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
      {/* خلفية معتمة بتمويه عالي */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-xl transition-opacity duration-700" onClick={onClose} />
      
      {/* بطاقة الذكر المزخرفة */}
      <div className="relative w-full max-w-sm overflow-hidden bg-[#0B192C] border-[3px] border-red-600/40 rounded-[4rem] shadow-[0_0_80px_rgba(239,68,68,0.3)] animate-slide-up">
        
        {/* زخارف إسلامية خلفية */}
        <div className="absolute inset-0 opacity-10 pointer-events-none flex items-center justify-center">
          <svg width="300" height="300" viewBox="0 0 100 100" className="text-red-500 fill-none stroke-current">
            <path d="M50 5 L95 50 L50 95 L5 50 Z" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="40" strokeWidth="0.5" strokeDasharray="2 2" />
            <path d="M50 15 L85 50 L50 85 L15 50 Z" strokeWidth="0.5" />
          </svg>
        </div>

        <div className="relative z-10 p-10 text-center space-y-10">
          {/* أيقونات علوية متحركة */}
          <div className="flex justify-center items-center gap-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-red-600"></div>
            <Moon size={32} className="text-red-500 fill-current animate-pulse" />
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-red-600"></div>
          </div>

          <div className="space-y-4">
            <p className="text-red-500 text-xs font-black tracking-[0.4em] uppercase opacity-60">
              نفحات إيمانية
            </p>
            {/* نص الذكر العشوائي */}
            <h2 className="text-white text-3xl md:text-4xl font-black leading-tight py-4 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] animate-fade-in">
              {randomDhikr}
            </h2>
          </div>

          <div className="flex flex-col items-center gap-6">
            <div className="flex gap-2">
               {[1, 2, 3].map(i => <Star key={i} size={14} className="text-red-500 fill-current animate-bounce" style={{ animationDelay: `${i*0.2}s` }} />)}
            </div>
            
            <button 
              onClick={onClose}
              className="group relative bg-red-600 hover:bg-red-500 text-white px-16 py-5 rounded-[2rem] font-black text-xl transition-all shadow-2xl shadow-red-900/40 active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">آمين</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            </button>
          </div>
        </div>

        {/* أيقونة قلب شفافة في الزاوية */}
        <div className="absolute -top-10 -left-10 text-red-600/5 rotate-45">
          <Heart size={180} fill="currentColor" />
        </div>
      </div>
    </div>
  );
};

export default DhikrPopup;
