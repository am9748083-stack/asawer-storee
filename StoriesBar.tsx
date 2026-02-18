
import React from 'react';
import { Story } from '../types';
import { Camera } from 'lucide-react';

interface StoriesBarProps {
  stories: Story[];
  onStoryClick: (index: number) => void;
}

const StoriesBar: React.FC<StoriesBarProps> = ({ stories, onStoryClick }) => {
  return (
    <div className="w-full bg-[#0B192C]/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <div className="flex items-start gap-6 overflow-x-auto no-scrollbar snap-x">
          
          {/* أيقونة الحالة الدائمة للمتجر */}
          <div className="flex flex-col items-center gap-2 flex-shrink-0 snap-start">
            <div className="relative w-16 h-16 rounded-full p-[2px] bg-white/10 flex items-center justify-center border border-white/5 group transition-all">
              <div className="w-full h-full rounded-full bg-[#1A2C42] flex items-center justify-center">
                <Camera size={20} className="text-white/30 group-hover:text-red-400 transition-colors" />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-4 border-[#0B192C] flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            <span className="text-[10px] font-bold text-white/30 uppercase tracking-tighter">متوفر الآن</span>
          </div>

          {/* عرض القصص الحقيقية */}
          {stories.map((story, index) => (
            <button 
              key={story.id} 
              onClick={() => onStoryClick(index)}
              className="flex flex-col items-center gap-2 flex-shrink-0 group snap-start animate-in fade-in zoom-in duration-500"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                {/* حلقة القصة المتدرجة */}
                <div className="w-[72px] h-[72px] rounded-full p-[3px] bg-gradient-to-tr from-red-600 via-red-500 to-amber-500 group-hover:rotate-180 transition-transform duration-700">
                  <div className="w-full h-full rounded-full border-[3px] border-[#0B192C] overflow-hidden bg-gray-900">
                    <img 
                      src={story.image_url} 
                      alt="Story" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                </div>
                {/* علامة التوقيت الصغيرة */}
                <div className="absolute -top-1 -left-1 bg-red-600 text-[8px] font-black px-1.5 py-0.5 rounded-md shadow-lg border border-[#0B192C]">
                  جديد
                </div>
              </div>
              <span className="text-[11px] font-black text-white/80 group-hover:text-red-400 transition-colors">
                أساور
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StoriesBar;
