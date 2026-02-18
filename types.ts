
export interface Product {
  id: string;
  name: string;
  price: number;
  weight: string;
  description?: string;
  category: Category;
  image: string;
  rating?: number;
  rating_count?: number;
  created_at?: string;
}

export interface Story {
  id: string;
  image_url: string;
  created_at: string;
  views: number;
  likes: number;
  media_type?: 'image' | 'video';
}

export interface MondayOffer {
  id: string;
  name: string;
  old_price: number;
  new_price: number;
  image: string;
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export enum Category {
  Chicken = 'دواجن',
  Beef = 'لحوم حمراء',
  Dairy = 'ألبان',
  Frozen = 'مجمدات',
  New = 'منتجات جديدة'
}

export interface CheckoutData {
  name: string;
  phone: string;
  address: string;
}

export interface StoreSettings {
  news_ticker: string;
  monday_offer: string;
  monday_offer_active: boolean;
}
