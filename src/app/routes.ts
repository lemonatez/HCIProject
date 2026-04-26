import { createBrowserRouter } from 'react-router';
import { Home } from './screens/Home';
import { Login } from './screens/Login';
import { NewOrder } from './screens/NewOrder';
import { Customize } from './screens/Customize';
import { OrderSummary } from './screens/OrderSummary';
import { Menu } from './screens/Menu';
import { Payment } from './screens/Payment';
import { QueueStatus } from './screens/QueueStatus';
import { Review } from './screens/Review';
import { AllReviews } from './screens/AllReviews';
import { Profile } from './screens/Profile';
import { AdminDashboard } from './screens/admin/Dashboard';
import { AdminOrderDetail } from './screens/admin/OrderDetail';
import { AdminAnalytics } from './screens/admin/Analytics';
import { AdminMenuManagement } from './screens/admin/MenuManagement';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Home
  },
  {
    path: '/login',
    Component: Login
  },
  {
    path: '/new-order',
    Component: NewOrder
  },
  {
    path: '/customize',
    Component: Customize
  },
  {
    path: '/order-summary',
    Component: OrderSummary
  },
  {
    path: '/menu',
    Component: Menu
  },
  {
    path: '/payment',
    Component: Payment
  },
  {
    path: '/queue/:orderId',
    Component: QueueStatus
  },
  {
    path: '/review/:orderId',
    Component: Review
  },
  {
    path: '/reviews',
    Component: AllReviews
  },
  {
    path: '/profile',
    Component: Profile
  },
  {
    path: '/admin',
    Component: AdminDashboard
  },
  {
    path: '/admin/orders/:orderId',
    Component: AdminOrderDetail
  },
  {
    path: '/admin/analytics',
    Component: AdminAnalytics
  },
  {
    path: '/admin/menu',
    Component: AdminMenuManagement
  }
]);
