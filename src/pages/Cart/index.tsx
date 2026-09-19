/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { motion, AnimatePresence } from 'motion/react';

const Cart: React.FC = () => {
  const { items, removeItem, updateQuantity, getSubtotal, getTotalItems } = useCartStore();
  const navigate = useNavigate();

  const shippingCost = 100; // Flat rate for now
  const total = getSubtotal() + (items.length > 0 ? shippingCost : 0);

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <Helmet>
          <title>আপনার কার্ট খালি - মাহমুদ টেলিকম</title>
        </Helmet>
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-12 rounded-[3rem] bg-gray-50 dark:bg-gray-800/50 mb-8"
        >
          <ShoppingBag className="w-20 h-20 text-gray-300 mb-6 mx-auto" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">আপনার কার্ট খালি</h1>
          <p className="text-gray-500 max-w-xs mx-auto">এখনই কেনাকাটা শুরু করুন এবং আপনার পছন্দের পণ্যটি কার্টে যোগ করুন।</p>
        </motion.div>
        <Link 
          to="/products"
          className="px-10 py-5 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-105 transition-transform"
        >
          কেনাকাটা শুরু করুন
        </Link>
      </div>
    );
  }

  return (
    <div className="py-12">
      <Helmet>
        <title>শপিং কার্ট - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 flex items-center space-x-4">
          <span>শপিং কার্ট</span>
          <span className="text-sm font-normal text-gray-400">({getTotalItems()}টি পণ্য)</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence>
              {items.map((item) => (
                <motion.div
                  key={item.productId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm"
                >
                  <img 
                    src={item.image} 
                    alt={item.name} 
                    className="w-24 h-24 rounded-2xl object-cover bg-gray-50 dark:bg-gray-900"
                  />
                  <div className="flex-1 ml-6">
                    <Link to={`/product/${item.productId}`} className="font-bold text-gray-900 dark:text-white hover:text-blue-600 transition-colors block mb-1">
                      {item.name}
                    </Link>
                    <p className="text-sm text-gray-500 mb-4">৳{item.price.toLocaleString()}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-10 text-center text-sm font-bold">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center hover:bg-white dark:hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button 
                        onClick={() => removeItem(item.productId)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                  <div className="ml-6 text-right hidden sm:block">
                    <p className="text-lg font-black text-gray-900 dark:text-white">
                      ৳{(item.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">অর্ডার সামারি</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>সাবটোটাল</span>
                  <span className="font-bold text-gray-900 dark:text-white">৳{getSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-600 dark:text-gray-400">
                  <span>ডেলিভারি চার্জ</span>
                  <span className="font-bold text-gray-900 dark:text-white">৳{shippingCost.toLocaleString()}</span>
                </div>
                <div className="border-t border-gray-100 dark:border-gray-900 pt-4 flex justify-between">
                  <span className="text-lg font-bold text-gray-900 dark:text-white">মোট</span>
                  <span className="text-2xl font-black text-blue-600">৳{total.toLocaleString()}</span>
                </div>
              </div>

              <button 
                onClick={() => navigate('/checkout')}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
              >
                <span>চেকআউট করুন</span>
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <Link 
                to="/products"
                className="block text-center mt-6 text-sm font-bold text-gray-400 hover:text-blue-600 transition-colors"
              >
                কেনাকাটা চালিয়ে যান
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
