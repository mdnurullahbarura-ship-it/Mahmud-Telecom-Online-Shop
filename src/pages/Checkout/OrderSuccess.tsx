/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { CheckCircle2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const OrderSuccess: React.FC = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>অর্ডার সফল - মাহমুদ টেলিকম</title>
      </Helmet>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-lg w-full bg-white dark:bg-gray-800 rounded-[3rem] p-10 md:p-16 text-center shadow-2xl shadow-green-500/10 border border-gray-100 dark:border-gray-800"
      >
        <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 text-green-500 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg">
          <CheckCircle2 className="w-12 h-12" />
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">অর্ডার সফল হয়েছে!</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-12 leading-relaxed">
          আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে। আমাদের প্রতিনিধি শীঘ্রই আপনার সাথে যোগাযোগ করবেন। আপনার অর্ডার আইডি আপনার ইমেইলে পাঠিয়ে দেওয়া হয়েছে।
        </p>

        <div className="space-y-4">
          <Link 
            to="/my-orders"
            className="w-full h-16 bg-blue-600 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2"
          >
            <span>অর্ডার ট্র্যাকিং</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link 
            to="/products"
            className="w-full h-16 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white rounded-2xl font-bold hover:bg-gray-200 dark:hover:bg-gray-800 transition-all flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="w-5 h-5" />
            <span>আরও কেনাকাটা করুন</span>
          </Link>
          
          <div className="pt-8">
            <a 
              href="https://wa.me/8801846655270"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 text-green-500 font-bold hover:underline"
            >
              <MessageCircle className="w-5 h-5" />
              <span>সরাসরি যোগাযোগ করুন</span>
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
