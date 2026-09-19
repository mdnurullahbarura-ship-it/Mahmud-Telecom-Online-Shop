/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ShoppingCart, Heart, Share2, Star, ShieldCheck, Truck, RotateCcw, MessageCircle } from 'lucide-react';
import { Product } from '../../types';
import { mockProducts } from '../../data/mockData';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState('');
  const { addItem } = useCartStore();

  useEffect(() => {
    const foundProduct = mockProducts.find(p => p.id === id);
    if (foundProduct) {
      setProduct(foundProduct);
      setActiveImage(foundProduct.images[0]);
    } else {
      toast.error('দুঃখিত, পণ্যটি খুঁজে পাওয়া যায়নি!');
      navigate('/products');
    }
  }, [id, navigate]);

  if (!product) return null;

  const handleAddToCart = () => {
    if (product.stockQuantity <= 0) {
      toast.error('দুঃখিত, পণ্যটি স্টকে নেই!');
      return;
    }
    addItem(product, quantity);
    toast.success('পণ্যটি কার্টে যোগ করা হয়েছে!');
  };

  const handleWhatsAppOrder = () => {
    const message = `হ্যালো মাহমুদ টেলিকম! আমি এই পণ্যটি কিনতে চাই:\n\n*পণ্য:* ${product.name}\n*দাম:* ৳${product.price}\n*পরিমাণ:* ${quantity}\n*লিঙ্ক:* ${window.location.href}`;
    const url = `https://wa.me/8801846655270?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="py-8 md:py-16">
      <Helmet>
        <title>{product.name} - মাহমুদ টেলিকম</title>
        <meta name="description" content={product.shortDescription} />
      </Helmet>

      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          {/* Image Gallery */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="aspect-square rounded-[3rem] overflow-hidden bg-white dark:bg-gray-800 shadow-2xl shadow-blue-500/5 border border-gray-100 dark:border-gray-800"
            >
              <img 
                src={activeImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`relative shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-2 transition-all ${
                    activeImage === img ? 'border-blue-600 scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-8">
              <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase tracking-widest mb-6">
                {product.brand} • {product.category}
              </span>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                {product.name}
              </h1>
              <div className="flex items-center space-x-6">
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="text-sm text-slate-500 font-medium ml-3">৫.০ (১২টি রিভিউ)</span>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-sm ${
                  product.stockQuantity > 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {product.stockQuantity > 0 ? `স্টক আছে (${product.stockQuantity})` : 'স্টক আউট'}
                </div>
              </div>
            </div>

            <div className="mb-10 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <div className="flex items-end space-x-4 mb-2">
                <span className="text-5xl font-black text-slate-900 dark:text-white">
                  ৳{product.price.toLocaleString()}
                </span>
                {product.previousPrice && (
                  <span className="text-2xl text-slate-400 line-through mb-1.5">
                    ৳{product.previousPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 font-medium italic">ভ্যাট এবং অন্যান্য ট্যাক্স অন্তর্ভুক্ত</p>
            </div>

            <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
              {product.shortDescription}
            </p>

            {/* Actions */}
            <div className="space-y-5 mb-12">
              <div className="flex items-center space-x-5">
                <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-[1.5rem] p-1.5 shadow-inner">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
                  >
                    -
                  </button>
                  <span className="w-14 text-center font-black text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(Math.min(product.stockQuantity, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center font-black text-xl hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-all shadow-sm"
                  >
                    +
                  </button>
                </div>
                <button 
                  onClick={handleAddToCart}
                  disabled={product.stockQuantity <= 0}
                  className="flex-1 h-16 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-[1.5rem] font-black text-lg shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <ShoppingCart className="w-6 h-6" />
                  <span>কার্টে যোগ করুন</span>
                </button>
              </div>

              <button 
                onClick={handleWhatsAppOrder}
                className="w-full h-16 bg-emerald-500 hover:bg-emerald-600 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-emerald-500/20 transition-all flex items-center justify-center space-x-3"
              >
                <MessageCircle className="w-6 h-6" />
                <span>ওয়াটসঅ্যাপে অর্ডার করুন</span>
              </button>
            </div>

            {/* Features Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-slate-200 dark:border-slate-800 pt-10">
              {[
                { icon: ShieldCheck, text: 'জেনুইন প্রোডাক্ট', color: 'text-indigo-500' },
                { icon: Truck, text: 'দ্রুত ডেলিভারি', color: 'text-indigo-500' },
                { icon: RotateCcw, text: '৭ দিন রিটার্ন', color: 'text-indigo-500' },
              ].map((item, i) => (
                <div key={i} className="flex items-center space-x-3 text-sm font-bold text-slate-500">
                  <div className={`p-2 rounded-xl bg-slate-100 dark:bg-slate-800 ${item.color}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Tabs / Detailed Info */}
        <div className="mt-20">
          <div className="border-b border-gray-200 dark:border-gray-800 mb-8">
            <button className="px-8 py-4 border-b-2 border-blue-600 font-bold text-gray-900 dark:text-white">
              বিস্তারিত বিবরণ
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 prose dark:prose-invert max-w-none">
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 h-fit">
              <h3 className="text-lg font-bold mb-6 text-gray-900 dark:text-white">স্পেসিফিকেশন</h3>
              <div className="space-y-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-gray-50 dark:border-gray-900 last:border-0">
                    <span className="text-sm text-gray-400">{key}</span>
                    <span className="text-sm font-bold text-gray-900 dark:text-white">{value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
