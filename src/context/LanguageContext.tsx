/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState } from 'react';

type Language = 'bn' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  bn: {
    'nav.home': 'হোম',
    'nav.products': 'পণ্য',
    'nav.categories': 'ক্যাটাগরি',
    'nav.cart': 'কার্ট',
    'nav.account': 'অ্যাকাউন্ট',
    'search.placeholder': 'পণ্য খুঁজুন...',
    'cart.empty': 'আপনার কার্ট খালি',
    'cart.checkout': 'চেকআউট',
    'whatsapp.order': 'ওয়াটসঅ্যাপে অর্ডার করুন',
    'product.stock': 'স্টক',
    'product.outOfStock': 'স্টক নেই',
    'product.addToCart': 'কার্টে যোগ করুন',
    'auth.login': 'লগইন',
    'auth.register': 'রেজিস্ট্রেশন',
    'admin.dashboard': 'অ্যাডমিন ড্যাশবোর্ড',
  },
  en: {
    'nav.home': 'Home',
    'nav.products': 'Products',
    'nav.categories': 'Categories',
    'nav.cart': 'Cart',
    'nav.account': 'Account',
    'search.placeholder': 'Search products...',
    'cart.empty': 'Your cart is empty',
    'cart.checkout': 'Checkout',
    'whatsapp.order': 'Order on WhatsApp',
    'product.stock': 'Stock',
    'product.outOfStock': 'Out of Stock',
    'product.addToCart': 'Add to Cart',
    'auth.login': 'Login',
    'auth.register': 'Register',
    'admin.dashboard': 'Admin Dashboard',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('bn');

  const t = (key: string) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within a LanguageProvider');
  return context;
};
