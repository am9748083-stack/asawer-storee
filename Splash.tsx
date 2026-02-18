
import React from 'react';
import { Moon, Star } from 'lucide-react';

interface SplashProps {
  onComplete: () => void;
}

const Splash: React.FC<SplashProps> = ({ onComplete }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#050A14] overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-20 scale-110 animate-pulse"
        style={{ backgroundImage: 'url(assets/background.jpg)' }}
      />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#050A14] via-transparent to-[#050A14]" />

      {/* هلال أحمر متوهج */}
      <div className="absolute top-10 left-10 text-red-500 opacity-40 floating-lantern">
        <Moon size={120} strokeWidth={1} className="rotate-12 fill-current" />
      </div>

      <div className="relative z-10 text-center space-y-8">
        <div className="w-56 h-56 bg-white/5 backdrop-blur-xl rounded-full flex items-center justify-center border-4 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)] mx-auto overflow-hidden p-6 animate-slide-up">
           <img src="assets/logo.png" alt="Logo" className="w-full h-full object-contain filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" onError={(e) => {
             (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/asawer-logo/300/300';
           }} />
        </div>
        
        <div className="space-y-2 animate-fade-in [animation-delay:0.5s]">
          <h1 className="text-white text-5xl font-black tracking-tight">
            أساور
          </h1>
          <p className="text-red-500 text-2xl font-bold tracking-[0.2em] animate-pulse">
            رمضان كريم
          </p>
        </div>

        <div className="flex justify-center gap-3 pt-4">
          {[1, 2, 3].map(i => (
            <Star key={i} size={16} className={`text-red-500 animate-bounce [animation-delay:${i*0.2}s] fill-current`} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Splash;
