
import { Product, Category } from './types';

export const SHOP_NAME = "أساور | لمنتجات اللحوم";
export const WHATSAPP_NUMBER = "+249114217219";
export const SHOP_LOCATION = "يمين جامع وراق – شمال برج العمدة – قصاد مجمع الرحمة الطبي";
export const DELIVERY_INFO = "التوصيل متاح في كافة أنحاء قرية التكينة";

export const PRODUCTS: Product[] = [
  // Chicken
  { id: 'c1', name: 'دجاج كامل طازج', price: 4500, weight: '1 كيلو', category: Category.Chicken, image: 'https://picsum.photos/seed/chicken1/400/300' },
  { id: 'c2', name: 'صدور دجاج', price: 5500, weight: '500 جرام', category: Category.Chicken, image: 'https://picsum.photos/seed/chicken2/400/300' },
  { id: 'c3', name: 'أفخاذ دجاج', price: 4200, weight: '1 كيلو', category: Category.Chicken, image: 'https://picsum.photos/seed/chicken3/400/300' },
  
  // Beef
  { id: 'b1', name: 'لحم بقري صافي', price: 9000, weight: '1 كيلو', category: Category.Beef, image: 'https://picsum.photos/seed/beef1/400/300' },
  { id: 'b2', name: 'كفتة لحم بقري', price: 7500, weight: '1 كيلو', category: Category.Beef, image: 'https://picsum.photos/seed/beef2/400/300' },
  { id: 'b3', name: 'لحم ضأن طازج', price: 11000, weight: '1 كيلو', category: Category.Beef, image: 'https://picsum.photos/seed/beef3/400/300' },

  // Dairy
  { id: 'd1', name: 'زبادي طازج', price: 1200, weight: '500 جرام', category: Category.Dairy, image: 'https://picsum.photos/seed/dairy1/400/300' },
  { id: 'd2', name: 'جبنة بيضاء', price: 3500, weight: '500 جرام', category: Category.Dairy, image: 'https://picsum.photos/seed/dairy2/400/300' },
  
  // Frozen
  { id: 'f1', name: 'برجر دجاج مجمد', price: 5000, weight: '12 قطعة', category: Category.Frozen, image: 'https://picsum.photos/seed/frozen1/400/300' },
  { id: 'f2', name: 'سجق بقري مجمد', price: 4800, weight: '500 جرام', category: Category.Frozen, image: 'https://picsum.photos/seed/frozen2/400/300' },
  
  // New
  { id: 'n1', name: 'ستيك بقري متبل', price: 9500, weight: '1 كيلو', category: Category.New, image: 'https://picsum.photos/seed/new1/400/300' },
];
