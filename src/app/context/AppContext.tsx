import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  membershipTier?: 'SILVER' | 'GOLD' | 'PLATINUM';
  rewardPoints?: number;
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  bestSeller?: boolean;
  allergies?: ('dairy' | 'seafood' | 'peanut' | 'gluten' | 'egg')[];
}

export interface OrderItem extends MenuItem {
  quantity: number;
  spiceLevel?: 'Mild' | 'Medium' | 'Spicy';
  addons?: string[];
  specialRequests?: string;
}

export type OrderStatus = 'pending' | 'cooking' | 'ready' | 'completed' | 'cancelled';

export interface Order {
  id: string;
  queueNumber: number;
  customerId: string;
  items: OrderItem[];
  status: OrderStatus;
  total: number;
  paymentMethod?: 'cash' | 'card' | 'qr';
  couponCode?: string;
  discount?: number;
  createdAt: Date;
  estimatedTime?: number;
  review?: {
    rating: number;
    feedback: string;
    tags: string[];
  };
}

interface AppContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  menuItems: MenuItem[];
  cart: OrderItem[];
  addToCart: (item: OrderItem) => void;
  removeFromCart: (itemId: string) => void;
  updateCartItem: (itemId: string, updates: Partial<OrderItem>) => void;
  clearCart: () => void;
  orders: Order[];
  createOrder: (paymentMethod: string, couponCode?: string) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  submitReview: (orderId: string, rating: number, feedback: string, tags: string[]) => void;
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  removeMenuItem: (id: string) => void;
  transactions: Array<{
    id: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    date: Date;
  }>;
  guestOrderIds: string[];
  addGuestOrderId: (orderId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const mockMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Margherita Pizza',
    price: 299,
    description: 'Tomato sauce, mozzarella cheese, fresh basil',
    image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop',
    category: 'Pizza',
    bestSeller: true,
    allergies: ['dairy', 'gluten']
  },
  {
    id: '2',
    name: 'Spicy Chicken Wings',
    price: 229,
    description: 'Crispy wings tossed in bold Buffalo sauce',
    image: 'https://images.unsplash.com/photo-1608039755401-742074f0548d?w=400&h=300&fit=crop',
    category: 'Appetizer',
    bestSeller: true,
    allergies: ['egg', 'gluten']
  },
  {
    id: '3',
    name: 'Caesar Salad',
    price: 189,
    description: 'Romaine lettuce, parmesan, croutons, Caesar dressing',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
    category: 'Salad',
    bestSeller: false,
    allergies: ['dairy', 'egg', 'gluten']
  },
  {
    id: '4',
    name: 'Beef Burger',
    price: 349,
    description: 'Angus beef patty, lettuce, tomato, cheddar cheese',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    category: 'Main',
    bestSeller: true,
    allergies: ['dairy', 'gluten']
  },
  {
    id: '5',
    name: 'Sushi Platter',
    price: 589,
    description: 'Assorted fresh sushi and sashimi selection',
    image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
    category: 'Seafood',
    bestSeller: false,
    allergies: ['seafood']
  },
  {
    id: '6',
    name: 'Pad Thai',
    price: 179,
    description: 'Rice noodles, shrimp, peanuts, tamarind sauce, tofu',
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
    category: 'Asian',
    bestSeller: true,
    allergies: ['seafood', 'peanut', 'egg']
  },
  {
    id: '7',
    name: 'Chocolate Lava Cake',
    price: 169,
    description: 'Warm chocolate cake with molten chocolate center',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400&h=300&fit=crop',
    category: 'Dessert',
    bestSeller: false,
    allergies: ['dairy', 'egg', 'gluten']
  },
  {
    id: '8',
    name: 'Iced Latte',
    price: 99,
    description: 'Cold espresso with fresh milk over ice',
    image: 'https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=300&fit=crop',
    category: 'Beverage',
    bestSeller: false,
    allergies: ['dairy']
  },
  {
    id: '9',
    name: 'Tom Yum Soup',
    price: 259,
    description: 'Spicy & sour soup with fresh prawns, mushrooms, lemongrass',
    image: 'https://images.unsplash.com/photo-1569562211093-4ed0d0758f12?w=400&h=300&fit=crop',
    category: 'Asian',
    bestSeller: true,
    allergies: ['seafood']
  },
  {
    id: '10',
    name: 'Grilled Ribeye Steak',
    price: 699,
    description: 'Premium ribeye, grilled to perfection, served with vegetables and black pepper sauce',
    image: 'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=400&h=300&fit=crop',
    category: 'Main',
    bestSeller: false,
    allergies: ['dairy']
  }
];

const mockSeedReviews: Order[] = [
  {
    id: 'seed-order-1',
    queueNumber: 88,
    customerId: 'customer-demo',
    items: [{ ...mockMenuItems[0], quantity: 1, spiceLevel: 'Mild' }],
    status: 'completed',
    total: 299,
    paymentMethod: 'qr',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    estimatedTime: 15,
    review: {
      rating: 5,
      feedback: 'Absolutely delicious! Service was super fast. Highly recommend!',
      tags: ['Delicious', 'Fast Service', 'Hot & Fresh']
    }
  },
  {
    id: 'seed-order-2',
    queueNumber: 89,
    customerId: 'customer-demo2',
    items: [{ ...mockMenuItems[3], quantity: 2, spiceLevel: 'Medium' }],
    status: 'completed',
    total: 698,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedTime: 20,
    review: {
      rating: 4,
      feedback: 'Very fresh and juicy meat, great flavor. Waited a little long but worth it.',
      tags: ['Delicious', 'Great Portions']
    }
  },
  {
    id: 'seed-order-3',
    queueNumber: 90,
    customerId: 'customer-demo3',
    items: [{ ...mockMenuItems[5], quantity: 1, spiceLevel: 'Spicy' }],
    status: 'completed',
    total: 179,
    paymentMethod: 'cash',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    estimatedTime: 12,
    review: {
      rating: 5,
      feedback: 'Best Pad Thai I have ever had! Crunchy peanuts, fresh shrimp — perfect!',
      tags: ['Delicious', 'Spicy', 'Hot & Fresh']
    }
  },
  {
    id: 'seed-order-4',
    queueNumber: 91,
    customerId: 'customer-demo4',
    items: [{ ...mockMenuItems[1], quantity: 1, spiceLevel: 'Spicy' }],
    status: 'completed',
    total: 229,
    paymentMethod: 'qr',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    estimatedTime: 10,
    review: {
      rating: 4,
      feedback: 'Super crispy wings, sauce level was just right. Loved it!',
      tags: ['Delicious', 'Spicy', 'Fast Service']
    }
  },
  {
    id: 'seed-order-5',
    queueNumber: 92,
    customerId: 'customer-demo5',
    items: [{ ...mockMenuItems[8], quantity: 1, spiceLevel: 'Spicy' }],
    status: 'completed',
    total: 259,
    paymentMethod: 'card',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    estimatedTime: 18,
    review: {
      rating: 3,
      feedback: 'Tom Yum was decent, but I would have preferred it spicier.',
      tags: ['Seafood']
    }
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(mockMenuItems);
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [orders, setOrders] = useState<Order[]>(mockSeedReviews);
  const [guestOrderIds, setGuestOrderIds] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Array<{
    id: string;
    orderId: string;
    amount: number;
    paymentMethod: string;
    date: Date;
  }>>([]);

  const login = (username: string, password: string): boolean => {
    if (username === 'admin' && password === 'admin') {
      setUser({
        id: 'admin-1',
        username: 'Admin',
        role: 'admin'
      });
      return true;
    } else if (username && password) {
      // Different tiers for demo purposes
      let tier: 'SILVER' | 'GOLD' | 'PLATINUM' = 'SILVER';
      let points = 250;
      if (username.toLowerCase().includes('gold')) {
        tier = 'GOLD';
        points = 750;
      } else if (username.toLowerCase().includes('platinum') || username.toLowerCase().includes('plat')) {
        tier = 'PLATINUM';
        points = 950;
      } else {
        tier = 'GOLD';
        points = 850;
      }

      setUser({
        id: 'customer-' + Math.random(),
        username: username,
        role: 'customer',
        membershipTier: tier,
        rewardPoints: points
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addToCart = (item: OrderItem) => {
    setCart(prev => [...prev, { ...item, id: item.id + '-' + Date.now() }]);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
  };

  const updateCartItem = (itemId: string, updates: Partial<OrderItem>) => {
    setCart(prev => prev.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    ));
  };

  const clearCart = () => {
    setCart([]);
  };

  const addGuestOrderId = (orderId: string) => {
    setGuestOrderIds(prev => [...prev, orderId]);
  };

  const createOrder = (paymentMethod: string, couponCode?: string): Order => {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    let discount = 0;
    if (couponCode === 'SAVE10') {
      discount = subtotal * 0.1;
    } else if (couponCode === 'SILVER15') {
      discount = subtotal * 0.15;
    } else if (couponCode === 'GOLD20' && (user?.membershipTier === 'GOLD' || user?.membershipTier === 'PLATINUM')) {
      discount = subtotal * 0.2;
    } else if (couponCode === 'PLATINUM30' && user?.membershipTier === 'PLATINUM') {
      discount = subtotal * 0.3;
    }

    const total = subtotal - discount;

    const newOrder: Order = {
      id: 'order-' + Date.now(),
      queueNumber: orders.filter(o => !o.id.startsWith('seed-')).length + 1,
      customerId: user?.id || '',
      items: cart,
      status: 'pending',
      total,
      paymentMethod: paymentMethod as any,
      couponCode,
      discount,
      createdAt: new Date(),
      estimatedTime: 15 + Math.floor(Math.random() * 10)
    };

    setOrders(prev => [...prev, newOrder]);
    setTransactions(prev => [...prev, {
      id: 'tx-' + Date.now(),
      orderId: newOrder.id,
      amount: total,
      paymentMethod,
      date: new Date()
    }]);

    // Track guest orders
    if (!user) {
      setGuestOrderIds(prev => [...prev, newOrder.id]);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? { ...order, status } : order
    ));
  };

  const submitReview = (orderId: string, rating: number, feedback: string, tags: string[]) => {
    setOrders(prev => prev.map(order =>
      order.id === orderId ? {
        ...order,
        review: { rating, feedback, tags },
        status: 'completed'
      } : order
    ));
  };

  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addMenuItem = (item: Omit<MenuItem, 'id'>) => {
    setMenuItems(prev => [...prev, { ...item, id: 'item-' + Date.now() }]);
  };

  const removeMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <AppContext.Provider value={{
      user,
      login,
      logout,
      menuItems,
      cart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      orders,
      createOrder,
      updateOrderStatus,
      submitReview,
      updateMenuItem,
      addMenuItem,
      removeMenuItem,
      transactions,
      guestOrderIds,
      addGuestOrderId
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
