/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { Package, ChevronRight, Clock, CheckCircle2, Truck, XCircle, ShoppingBag } from 'lucide-react';
import { db } from '../../services/firebase/config';
import { useAuthStore } from '../../store/useAuthStore';
import { Order, OrderStatus } from '../../types';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

const MyOrders: React.FC = () => {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user) return;
      try {
        const q = query(
          collection(db, 'orders'),
          where('customerId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snap = await getDocs(q);
        setOrders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() }) as Order));
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const getStatusInfo = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING: return { icon: Clock, color: 'text-amber-500', bg: 'bg-amber-100', label: 'পেন্ডিং' };
      case OrderStatus.CONFIRMED: return { icon: CheckCircle2, color: 'text-blue-500', bg: 'bg-blue-100', label: 'নিশ্চিত' };
      case OrderStatus.DELIVERED: return { icon: CheckCircle2, color: 'text-green-500', bg: 'bg-green-100', label: 'ডেলিভারড' };
      case OrderStatus.CANCELLED: return { icon: XCircle, color: 'text-red-500', bg: 'bg-red-100', label: 'বাতিল' };
      default: return { icon: Truck, color: 'text-indigo-500', bg: 'bg-indigo-100', label: status };
    }
  };

  if (loading) return null;

  return (
    <div className="py-12 md:py-20 min-h-screen">
      <Helmet>
        <title>আমার অর্ডার সমূহ - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center space-x-4">
          <Package className="w-8 h-8 text-blue-600" />
          <span>আমার অর্ডার সমূহ</span>
        </h1>

        {orders.length > 0 ? (
          <div className="space-y-6">
            {orders.map((order) => {
              const status = getStatusInfo(order.status);
              return (
                <motion.div
                  key={order.id}
                  whileHover={{ x: 5 }}
                  className="bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
                >
                  <Link to={`/order/${order.id}`} className="block p-6 md:p-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6 mb-6">
                      <div className="flex items-start space-x-4">
                        <div className={`p-4 rounded-2xl ${status.bg} ${status.color}`}>
                          <status.icon className="w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">অর্ডার নম্বর</p>
                          <h3 className="text-lg font-black text-gray-900 dark:text-white">#{order.orderNumber}</h3>
                          <p className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">মোট দাম</p>
                        <h3 className="text-xl font-black text-blue-600">৳{order.total.toLocaleString()}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest mt-2 ${status.bg} ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between border-t border-gray-50 dark:border-gray-700 pt-6">
                      <div className="flex -space-x-3 overflow-hidden">
                        {order.items.slice(0, 3).map((item, i) => (
                          <img 
                            key={i}
                            src={item.image} 
                            className="inline-block h-10 w-10 rounded-full ring-2 ring-white dark:ring-gray-800 object-cover" 
                            alt="" 
                          />
                        ))}
                        {order.items.length > 3 && (
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 ring-2 ring-white dark:ring-gray-800 text-[10px] font-bold">
                            +{order.items.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center text-sm font-bold text-blue-600 group">
                        <span>বিস্তারিত দেখুন</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[3.5rem] border-2 border-dashed border-gray-200 dark:border-gray-800">
            <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">আপনি এখনো কোনো অর্ডার করেননি</h2>
            <p className="text-gray-500 mb-10 max-w-xs mx-auto">আমাদের শপে সেরা ব্র্যান্ডের মোবাইল এবং অ্যাক্সেসরিজ কালেকশন দেখুন।</p>
            <Link 
              to="/products"
              className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
            >
              কেনাকাটা শুরু করুন
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
