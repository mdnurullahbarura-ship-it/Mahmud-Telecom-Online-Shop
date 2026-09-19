/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Grid, ArrowRight } from 'lucide-react';
import { mockCategories } from '../../data/mockData';
import { motion } from 'motion/react';

const Categories: React.FC = () => {
  return (
    <div className="py-12 md:py-20">
      <Helmet>
        <title>ক্যাটাগরি সমূহ - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">ক্যাটাগরি সমূহ</h1>
          <p className="text-gray-500">আপনার প্রয়োজনীয় পণ্যটি দ্রুত খুঁজে পেতে ক্যাটাগরি ব্যবহার করুন।</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {mockCategories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Link 
                to={`/products?category=${cat.slug}`}
                className="group block relative h-64 rounded-[2.5rem] overflow-hidden bg-gradient-to-br from-blue-600 to-blue-800 shadow-xl shadow-blue-500/10"
              >
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white">
                  <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md mb-4 group-hover:scale-110 transition-transform">
                    <Grid className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{cat.name}</h3>
                  <div className="flex items-center space-x-2 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>পণ্য দেখুন</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Categories;
