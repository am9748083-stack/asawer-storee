
import React from 'react';
import { MessageCircle, X, ExternalLink } from 'lucide-react';

interface WhatsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WhatsAppModal: React.FC<WhatsAppModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const handleConfirm = () => {
    window.open('https://whatsapp.com/channel/0029Vb6wdaL4tRrl9Z9qF63G', '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity duration-500 animate-fade-in" 
        onClick={onClose} 
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-sm bg-[#0B192C] border-2 border-green-500/30 rounded-[3.5rem] shadow-[0_0_50px_rgba(34,197,94,0.2)] overflow-hidden animate-slide-up">
        
        {/* Header Decor */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-green-600/20 to-transparent pointer-events-none" />
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all"
        >
          <X size={20} />
        </button>

        <div className="relative z-10 p-10 text-center flex flex-col items-center">
          {/* Circular Logo */}
          <div className="w-24 h-24 rounded-full bg-white p-2 shadow-2xl mb-8 border-4 border-green-500 animate-bounce">
            <img 
              src="assets/logo.png" 
              alt="Asawer Logo" 
              className="w-full h-full object-contain"
              onError={(e) => (e.target as HTMLImageElement).src = 'https://picsum.photos/seed/asawer-logo/200/200'}
            />
          </div>

          <div className="bg-green-600/10 p-4 rounded-2xl mb-6">
            <MessageCircle size={32} className="text-green-500 animate-pulse" />
          </div>

          <h3 className="text-xl font-black text-white mb-4 leading-relaxed">
            أنت الآن تغادر المتجر
          </h3>
          
          <p className="text-white/60 text-sm font-bold leading-relaxed mb-10 px-4">
            سوف يتم تحويلك الآن لقناة <span className="text-green-500">أساور</span> الرسمية على واتساب لمتابعة أحدث العروض والمنتجات.
          </p>

          <button 
            onClick={handleConfirm}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-5 rounded-[1.8rem] font-black text-lg shadow-xl shadow-green-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 group"
          >
            <span>موافق، تحويل الآن</span>
            <ExternalLink size={20} className="group-hover:translate-x-[-4px] transition-transform" />
          </button>
          
          <button 
            onClick={onClose}
            className="mt-6 text-white/20 hover:text-white/40 font-bold text-xs uppercase tracking-widest transition-colors"
          >
            إلغاء
          </button>
        </div>

        {/* Decorative Stars */}
        <div className="absolute bottom-6 left-6 opacity-10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
        </div>
        <div className="absolute top-12 right-12 opacity-10">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-ping [animation-delay:1s]" />
        </div>
      </div>
    </div>
  );
};

export default WhatsAppModal;
