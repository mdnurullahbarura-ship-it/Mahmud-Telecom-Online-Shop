/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MessageCircle,
  Package
} from 'lucide-react';
import { db } from '../../services/firebase/config';
import { Order, OrderStatus } from '../../types';
import { motion } from 'motion/react';

const OrderDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        } else {
          navigate('/my-orders');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  if (loading || !order) return null;

  return (
    <div className="py-12 md:py-20 min-h-screen bg-gray-50 dark:bg-gray-900/50">
      <Helmet>
        <title>অর্ডার #{order.orderNumber} - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <Link to="/my-orders" className="inline-flex items-center space-x-2 text-sm font-bold text-gray-400 hover:text-blue-600 mb-10 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>অর্ডার লিস্টে ফিরে যান</span>
        </Link>

        <div className="bg-white dark:bg-gray-800 rounded-[3rem] p-8 md:p-12 shadow-xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-12">
            <div>
              <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">অর্ডার ডিটেইলস</h1>
              <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">অর্ডার আইডি: #{order.orderNumber}</p>
            </div>
            <div className="px-6 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block mb-1">অবস্থা</span>
              <span className="text-blue-600 font-black uppercase">{order.status}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span>ডেলিভারি ঠিকানা</span>
              </h3>
              <div className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                <p className="font-bold text-gray-900 dark:text-white">{order.customerName}</p>
                <p>{order.mobileNumber}</p>
                <p>{order.address}</p>
                <p>{order.area}, {order.district}</p>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-bold text-gray-900 dark:text-white flex items-center space-x-2">
                <Package className="w-5 h-5 text-blue-600" />
                <span>অর্ডার সামারি</span>
              </h3>
              <div className="space-y-4">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-gray-900 dark:text-white">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
                <div className="pt-4 border-t border-gray-50 dark:border-gray-700 flex justify-between font-black text-lg">
                  <span className="text-gray-900 dark:text-white">মোট</span>
                  <span className="text-blue-600">৳{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-50 dark:border-gray-700 text-center">
            <a 
              href={`https://wa.me/8801846655270?text=${encodeURIComponent(`আমার অর্ডার #${order.orderNumber} সম্পর্কে জানতে চাই।`)}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-3 px-8 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg hover:scale-105 transition-transform"
            >
              <MessageCircle className="w-5 h-5" />
              <span>সরাসরি সাহায্য নিন</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
