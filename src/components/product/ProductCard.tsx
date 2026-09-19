/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart, Share2, Star } from 'lucide-react';
import { Product } from '../../types';
import { useCartStore } from '../../store/useCartStore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addItem } = useCartStore();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (product.stockQuantity <= 0) {
      toast.error('দুঃখিত, পণ্যটি স্টকে নেই!');
      return;
    }
    
    addItem(product);
    toast.success('পণ্যটি কার্টে যোগ করা হয়েছে!');
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      className="group relative bg-white dark:bg-slate-900 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all border border-slate-100 dark:border-slate-800"
    >
      {/* Badges */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        {product.discount && (
          <span className="px-3 py-1 bg-red-500 text-white text-[10px] font-bold rounded-full shadow-lg">
            -{product.discount}% ছাড়
          </span>
        )}
        {product.isFeatured && (
          <span className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-full shadow-lg">
            ফ্ল্যাশ ডিল
          </span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-10 group-hover:translate-x-0 transition-all duration-300">
        <button className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-md hover:bg-indigo-600 hover:text-white transition-colors">
          <Heart className="w-4 h-4" />
        </button>
        <button className="p-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 backdrop-blur shadow-md hover:bg-indigo-600 hover:text-white transition-colors">
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* Image Container */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-slate-50 dark:bg-slate-950">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-contain p-6 group-hover:scale-110 transition-transform duration-700"
        />
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] flex items-center justify-center">
            <span className="px-4 py-2 bg-white/90 rounded-full text-xs font-bold text-slate-900 uppercase tracking-widest">
              স্টক আউট
            </span>
          </div>
        )}
      </Link>

      {/* Content */}
      <div className="p-6">
        <div className="flex items-center space-x-1 mb-3 text-amber-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
          <span className="text-[10px] text-slate-400 ml-1 font-medium">(২৪ রিভিউ)</span>
        </div>
        
        <Link to={`/product/${product.id}`} className="block mb-2 group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-900 dark:text-white line-clamp-2 leading-tight h-10">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-bold tracking-wider mb-4">
          {product.brand} • {product.category}
        </p>

        <div className="flex items-end justify-between">
          <div className="flex flex-col">
            {product.previousPrice && (
              <span className="text-xs text-slate-400 line-through mb-0.5">
                ৳{product.previousPrice.toLocaleString()}
              </span>
            )}
            <span className="text-xl font-black text-slate-900 dark:text-white">
              ৳{product.price.toLocaleString()}
            </span>
          </div>
          
          <button 
            onClick={handleAddToCart}
            disabled={product.stockQuantity <= 0}
            className={`p-3.5 rounded-2xl transition-all ${
              product.stockQuantity > 0 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl shadow-slate-900/10 hover:scale-110 active:scale-95' 
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
