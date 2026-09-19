/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'motion/react';
import { ArrowRight, ShoppingBag, Zap, Shield, Truck, Headset } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProducts, mockCategories } from '../../data/mockData';
import ProductCard from '../../components/product/ProductCard';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      <Helmet>
        <title>মাহমুদ টেলিকম - সেরা মোবাইল ও ইলেকট্রনিক্স অনলাইন শপ</title>
        <meta name="description" content="মাহমুদ টেলিকম - আপনার পছন্দের মোবাইল ফোন, অ্যাক্সেসরিজ এবং ইলেকট্রনিক্স পণ্য কিনুন সেরা দামে।" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center pt-8 pb-16">
        <div className="absolute inset-0 bg-indigo-50/50 dark:bg-slate-900/50 -z-10" />
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wider uppercase mb-8">
              Premium Collection 2024
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] mb-8 text-slate-900 dark:text-white tracking-tight">
              সেরা প্রযুক্তি <br />
              আপনার <span className="text-indigo-600 dark:text-indigo-400">হাতের মুঠোয়</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
              মাহমুদ টেলিকম-এ পান জেনুইন স্মার্টফোন এবং লেটেস্ট গ্যাজেট। আমরা দিচ্ছি ১০০% অরিজিনাল পণ্যের গ্যারান্টি।
            </p>
            <div className="flex flex-wrap justify-center lg:justify-start gap-5">
              <Link 
                to="/products"
                className="px-10 py-4.5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-2xl font-bold shadow-2xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all flex items-center space-x-3 group"
              >
                <span>কেনাকাটা শুরু করুন</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/categories"
                className="px-10 py-4.5 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                ক্যাটাগরি দেখুন
              </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-10 bg-indigo-500/10 rounded-full blur-3xl" />
            <img 
              src="https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&q=80&w=1000" 
              alt="Premium Smartphone" 
              className="relative w-full max-w-lg mx-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.15)] hover:scale-105 transition-transform duration-700"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Shield, title: '১০০% অরিজিনাল', desc: 'জেনুইন পণ্যের গ্যারান্টি' },
              { icon: Zap, title: 'দ্রুত ডেলিভারি', desc: 'সারা দেশে ক্যাশ অন ডেলিভারি' },
              { icon: Truck, title: 'ফ্রি শিপিং', desc: 'নির্দিষ্ট অর্ডারের উপর ফ্রি ডেলিভারি' },
              { icon: Headset, title: '২৪/৭ সাপোর্ট', desc: 'সব সময় আপনার পাশে' },
            ].map((feature, i) => (
              <div key={i} className="p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center space-x-4">
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 dark:text-white">{feature.title}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">ক্যাটাগরি সমূহ</h2>
              <p className="text-slate-500 font-medium">আপনার প্রয়োজনীয় পণ্যটি বেছে নিন</p>
            </div>
            <Link to="/categories" className="px-6 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 font-bold flex items-center space-x-2 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all">
              <span>সব দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {mockCategories.map((cat, i) => (
              <Link 
                key={cat.id} 
                to={`/products?category=${cat.slug}`}
                className={`group relative h-48 rounded-[2.5rem] overflow-hidden ${
                  i % 2 === 0 ? 'bg-indigo-600' : 'bg-slate-900'
                } shadow-xl hover:shadow-indigo-500/20 transition-all`}
              >
                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-6 text-center">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-black tracking-tight">{cat.name}</h3>
                  <span className="text-xs font-medium text-white/60 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">Explore More</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-slate-50 dark:bg-slate-950/50">
        <div className="container mx-auto px-4">
          <div className="flex items-end justify-between mb-16">
            <div>
              <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">জনপ্রিয় পণ্য</h2>
              <p className="text-slate-500 font-medium">সেরা এবং লেটেস্ট কালেকশন</p>
            </div>
            <Link to="/products" className="text-indigo-600 font-bold flex items-center space-x-2 hover:underline">
              <span>সব দেখুন</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {mockProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* WhatsApp CTA */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="relative rounded-[4rem] bg-slate-900 p-12 md:p-20 text-center text-white overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] tracking-tight">দ্রুত অর্ডারের জন্য <br /> আমাদের সাথে <span className="text-indigo-400">যোগাযোগ করুন</span></h2>
              <p className="text-lg md:text-xl text-slate-400 mb-12 leading-relaxed">
                ওয়েবসাইটে অর্ডার করতে সমস্যা হচ্ছে? সরাসরি ওয়াটসঅ্যাপে মেসেজ দিন এবং আপনার পণ্যটি নিশ্চিত করুন। আমরা আপনার সেবায় সদা প্রস্তুত।
              </p>
              <div className="flex flex-wrap justify-center gap-6">
                <a 
                  href="https://wa.me/8801846655270"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center space-x-4 px-12 py-6 bg-white text-slate-900 rounded-[2rem] font-black text-xl shadow-2xl hover:scale-105 transition-transform group"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" className="w-8 h-8" />
                  <span>ওয়াটসঅ্যাপ মেসেজ</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
