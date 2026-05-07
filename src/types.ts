export type Category = 'Mains' | 'Sides' | 'Drinks' | 'Desserts';
export type OrderStatus = 'New' | 'Preparing' | 'Ready' | 'Completed';
export type OrderType = 'Delivery' | 'Pickup';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  isAvailable: boolean;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id?: string;
  customerName: string;
  phone: string;
  address: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  notes?: string;
  timestamp: any; // Firestore Timestamp
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'superadmin' | 'manager';
}
