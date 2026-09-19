/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { doc, collection, addDoc, serverTimestamp, runTransaction } from 'firebase/firestore';
import { User as UserIcon, Phone, MapPin, ClipboardList, CheckCircle2, Loader2 } from 'lucide-react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { db } from '../../services/firebase/config';
import { OrderStatus } from '../../types';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Checkout: React.FC = () => {
  const { items, getSubtotal, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    phone: user?.phoneNumber || '',
    address: '',
    district: '',
    area: '',
    note: '',
  });

  const shippingCost = 100;
  const total = getSubtotal() + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      // Use transaction to ensure stock validation and order creation are atomic
      await runTransaction(db, async (transaction) => {
        // 1. Verify stock for each item
        for (const item of items) {
          const productRef = doc(db, 'products', item.productId);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Product ${item.name} no longer exists.`);
          }
          
          const currentStock = productDoc.data().stockQuantity;
          if (currentStock < item.quantity) {
            throw new Error(`${item.name} has only ${currentStock} units left.`);
          }
        }

        // 2. Create the order
        const orderNumber = `MAT-${Date.now().toString().slice(-6)}`;
        const orderData = {
          orderNumber,
          customerId: user?.uid,
          customerName: formData.name,
          mobileNumber: formData.phone,
          address: formData.address,
          district: formData.district,
          area: formData.area,
          items,
          subtotal: getSubtotal(),
          shippingCost,
          total,
          status: OrderStatus.PENDING,
          note: formData.note,
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };

        const ordersRef = collection(db, 'orders');
        const newOrderRef = doc(ordersRef);
        transaction.set(newOrderRef, orderData);

        // 3. Update stock quantities
        for (const item of items) {
          const productRef = doc(db, 'products', item.productId);
          transaction.update(productRef, {
            stockQuantity: item.stockQuantity - item.quantity
          });
        }
      });

      toast.success('অর্ডারটি সফলভাবে সম্পন্ন হয়েছে!');
      clearCart();
      navigate('/order-success');
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast.error(error.message || 'অর্ডার করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="py-12 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <Helmet>
        <title>চেকআউট - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-10">চেকআউট</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Shipping Info */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5"
            >
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center space-x-3">
                <MapPin className="w-6 h-6 text-blue-600" />
                <span>ডেলিভারি তথ্য</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">নাম</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="আপনার নাম"
                    />
                    <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">মোবাইল নম্বর</label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="০১৮XXXXXXXX"
                    />
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">বিস্তারিত ঠিকানা</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      required
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="বাসা/রোড/এলাকা"
                    />
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">জেলা</label>
                  <input
                    type="text"
                    name="district"
                    required
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="যেমন: ঢাকা"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">উপজেলা/থানা</label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleInputChange}
                    className="w-full h-14 px-6 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                    placeholder="যেমন: ধানমণ্ডি"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4">অর্ডার নোট (ঐচ্ছিক)</label>
                  <div className="relative">
                    <textarea
                      name="note"
                      rows={3}
                      value={formData.note}
                      onChange={handleInputChange}
                      className="w-full p-6 pl-12 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                      placeholder="অর্ডার সম্পর্কে কোনো বিশেষ তথ্য থাকলে লিখুন..."
                    />
                    <ClipboardList className="absolute left-4 top-6 w-5 h-5 text-gray-400" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Order Summary Checkout */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-blue-500/5 sticky top-24">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8">অর্ডার ডিটেইলস</h2>
              
              <div className="max-h-60 overflow-y-auto mb-8 pr-2 space-y-4 scrollbar-hide">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between text-sm">
                    <span className="text-gray-500 line-clamp-1 flex-1">{item.name} x {item.quantity}</span>
                    <span className="font-bold text-gray-900 dark:text-white ml-4">৳{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-gray-100 dark:border-gray-900 pt-6 mb-8">
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
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full h-16 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-6 h-6" />
                    <span>অর্ডার কনফার্ম করুন</span>
                  </>
                )}
              </button>
              
              <p className="mt-6 text-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
                ক্যাশ অন ডেলিভারি প্রযোজ্য
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
