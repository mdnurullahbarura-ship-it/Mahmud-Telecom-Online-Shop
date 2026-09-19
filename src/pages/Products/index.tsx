/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { Search, Filter, Grid, List as ListIcon, X } from 'lucide-react';
import { db } from '../../services/firebase/config';
import { Product, Category } from '../../types';
import { mockProducts, mockCategories } from '../../data/mockData';
import ProductCard from '../../components/product/ProductCard';
import { motion, AnimatePresence } from 'motion/react';

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('q') || '';

  useEffect(() => {
    fetchData();
  }, [categoryParam, searchParam]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // In production, we'd fetch from Firestore
      // For now, using mock data with client-side filtering
      let filtered = [...mockProducts];

      if (categoryParam !== 'all') {
        filtered = filtered.filter(p => p.category === categoryParam);
      }

      if (searchParam) {
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchParam.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchParam.toLowerCase())
        );
      }

      setProducts(filtered);
      setCategories(mockCategories);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (slug: string) => {
    if (slug === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', slug);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="py-8 md:py-12">
      <Helmet>
        <title>আমাদের পণ্যসমূহ - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">আমাদের পণ্যসমূহ</h1>
            <p className="text-gray-500">{products.length}টি পণ্য পাওয়া গেছে</p>
          </div>
          
          <div className="flex items-center space-x-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input
                type="text"
                placeholder="পণ্য খুঁজুন..."
                value={searchParam}
                onChange={(e) => {
                  if (e.target.value) {
                    searchParams.set('q', e.target.value);
                  } else {
                    searchParams.delete('q');
                  }
                  setSearchParams(searchParams);
                }}
                className="w-full h-12 pl-12 pr-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm focus:ring-2 focus:ring-blue-500 transition-all text-sm"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-800 shadow-sm text-gray-500 hover:text-blue-600 lg:hidden"
            >
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex gap-12">
          {/* Filters Sidebar */}
          <aside className={`fixed inset-0 z-50 lg:relative lg:inset-auto lg:block lg:w-72 bg-white dark:bg-gray-900 lg:bg-transparent p-8 lg:p-0 transition-transform duration-300 ${showFilters ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="flex justify-between items-center mb-10 lg:hidden">
              <h2 className="text-xl font-bold">ফিল্টার</h2>
              <button onClick={() => setShowFilters(false)} className="p-2 text-gray-400">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-10">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">ক্যাটাগরি</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleCategoryChange('all')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                      categoryParam === 'all' 
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                        : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    সব পণ্য
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.slug)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all ${
                        categoryParam === cat.slug 
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20' 
                          : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">ব্র্যান্ড</h3>
                <div className="space-y-3">
                  {['Apple', 'Samsung', 'Sony', 'Xiaomi'].map((brand) => (
                    <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                      <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                      <span className="text-sm font-bold text-gray-500 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">
                        {brand}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse bg-gray-100 dark:bg-gray-800 rounded-[2rem] aspect-[4/5]" />
                ))}
              </div>
            ) : products.length > 0 ? (
              <motion.div 
                layout
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence>
                  {products.map((product) => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ProductCard product={product} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-[3rem]">
                <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">কোন পণ্য পাওয়া যায়নি</h2>
                <p className="text-gray-500">আপনার সার্চ বা ফিল্টার পরিবর্তন করে পুনরায় চেষ্টা করুন।</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
