
import React, { useState, useEffect, useRef } from 'react';
import { Story } from '../types';
import { X, Heart, MessageCircle, Send, Eye } from 'lucide-react';
import { WHATSAPP_NUMBER } from '../constants';
import { supabase } from '../lib/supabase';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

interface FloatingHeart {
  id: number;
  x: number;
  y: number;
  size: number;
  rotation: number;
  offsetX: number;
  offsetY: number;
}

const StoryViewer: React.FC<StoryViewerProps> = ({ stories, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [hearts, setHearts] = useState<FloatingHeart[]>([]);
  const [localStats, setLocalStats] = useState({ views: 0, likes: 0 });
  
  const lastTapRef = useRef<number>(0);
  const clickTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const currentStory = stories[currentIndex];
    if (currentStory) {
      setLocalStats({ views: currentStory.views || 0, likes: currentStory.likes || 0 });
      incrementViews(currentStory.id);
    }

    setProgress(0);
    const duration = 5000;
    const interval = 50;
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + step;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [currentIndex]);

  const incrementViews = async (storyId: string) => {
    try {
      const { data } = await supabase.from('stories').select('views').eq('id', storyId).single();
      const currentViews = data?.views || 0;
      await supabase.from('stories').update({ views: currentViews + 1 }).eq('id', storyId);
      setLocalStats(prev => ({ ...prev, views: currentViews + 1 }));
    } catch (e) {}
  };

  const incrementLikes = async (storyId: string) => {
    try {
      const { data } = await supabase.from('stories').select('likes').eq('id', storyId).single();
      const currentLikes = data?.likes || 0;
      await supabase.from('stories').update({ likes: currentLikes + 1 }).eq('id', storyId);
      setLocalStats(prev => ({ ...prev, likes: currentLikes + 1 }));
    } catch (e) {}
  };

  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const spawnHearts = (x: number, y: number) => {
    const newHearts: FloatingHeart[] = [];
    for (let i = 0; i < 10; i++) {
      newHearts.push({
        id: Math.random() + Date.now(),
        x, y,
        size: i === 0 ? 110 : 30 + Math.random() * 40,
        rotation: Math.random() * 90 - 45,
        offsetX: (Math.random() - 0.5) * 280,
        offsetY: -(250 + Math.random() * 300)
      });
    }
    setHearts(prev => [...prev, ...newHearts]);
    incrementLikes(stories[currentIndex].id);

    setTimeout(() => {
      setHearts(prev => prev.filter(h => !newHearts.find(nh => nh.id === h.id)));
    }, 1200);
  };

  const handleInteraction = (e: React.MouseEvent | React.TouchEvent) => {
    if (e.cancelable) e.preventDefault();
    const now = Date.now();
    let clientX;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
    } else {
      clientX = (e as React.MouseEvent).clientX;
    }

    if (now - lastTapRef.current < 300) {
      if (clickTimeoutRef.current) clearTimeout(clickTimeoutRef.current);
      spawnHearts(clientX, window.innerHeight/2);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        const screenWidth = window.innerWidth;
        if (clientX < screenWidth / 3) handlePrev();
        else handleNext();
      }, 300);
    }
    lastTapRef.current = now;
  };

  const currentStory = stories[currentIndex];

  return (
    <div className="fixed inset-0 z-[250] bg-black flex items-center justify-center animate-in fade-in duration-300 select-none touch-none">
      <div className="relative w-full max-w-lg h-full overflow-hidden flex flex-col shadow-2xl">
        
        {hearts.map(heart => (
          <div 
            key={heart.id}
            className="fixed z-[100] pointer-events-none animate-tiktok-heart"
            style={{ 
              left: heart.x, 
              top: heart.y,
              '--offset-x': `${heart.offsetX}px`,
              '--offset-y': `${heart.offsetY}px`,
              '--rotation': `${heart.rotation}deg`,
              transform: 'translate(-50%, -50%)'
            } as React.CSSProperties}
          >
            <Heart size={heart.size} className="text-red-500 fill-current" />
          </div>
        ))}

        <div className="absolute top-4 left-4 right-4 z-[60] flex gap-2">
          {stories.map((_, idx) => (
            <div key={idx} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
              <div 
                className="h-full bg-white transition-all duration-[50ms]"
                style={{ width: idx === currentIndex ? `${progress}%` : idx < currentIndex ? '100%' : '0%' }}
              />
            </div>
          ))}
        </div>

        <div className="absolute top-10 left-0 right-0 z-[60] px-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 rounded-full border-2 border-red-500 p-0.5 bg-white overflow-hidden">
              <img src="assets/logo.png" className="w-full h-full object-contain" alt="logo" />
            </div>
            <p className="text-white font-black">أساور | التكينة</p>
          </div>
          <button onClick={onClose} className="p-2.5 bg-white/10 rounded-full text-white"><X size={24} /></button>
        </div>

        <div 
          className="flex-1 relative flex items-center justify-center cursor-pointer"
          onMouseDown={handleInteraction}
          onTouchStart={handleInteraction}
        >
          {currentStory.media_type === 'video' ? (
            <video 
              src={currentStory.image_url} 
              className="w-full h-full object-cover md:object-contain"
              autoPlay 
              muted 
              loop 
              playsInline
            />
          ) : (
            <img src={currentStory.image_url} className="w-full h-full object-cover md:object-contain" />
          )}

          <div className="absolute bottom-40 right-4 flex flex-col gap-6 items-center">
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center border border-white/10">
                <Heart size={26} className="text-red-500 fill-current" />
              </div>
              <span className="text-white text-xs font-black">{localStats.likes}</span>
            </div>
            <div className="flex flex-col items-center gap-1">
              <div className="w-12 h-12 bg-black/40 rounded-full flex items-center justify-center border border-white/10">
                <Eye size={26} className="text-white" />
              </div>
              <span className="text-white text-xs font-black">{localStats.views}</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-[70] p-8 bg-gradient-to-t from-black to-transparent">
          <div className="flex items-center gap-4">
            <div className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-4">
              <input type="text" placeholder="رد على الحالة..." className="bg-transparent text-white text-base w-full outline-none font-bold" />
            </div>
            <button 
              onClick={(e) => { 
                e.stopPropagation(); 
                window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=أود الاستفسار عن الحالة: ${currentStory.image_url}`);
              }}
              className="bg-red-600 p-4 rounded-full text-white"
            >
              <Send size={22} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes tiktok-heart {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0; }
          15% { transform: translate(-50%, -50%) scale(1.5) rotate(var(--rotation)); opacity: 1; }
          30% { transform: translate(-50%, -50%) scale(1) rotate(var(--rotation)); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--offset-x)), calc(-120% + var(--offset-y))) scale(2) rotate(calc(var(--rotation) * 2.5)); opacity: 0; }
        }
        .animate-tiktok-heart { animation: tiktok-heart 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
      `}</style>
    </div>
  );
};

export default StoryViewer;
