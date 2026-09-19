/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { 
  User, 
  Package, 
  MapPin, 
  Settings, 
  LogOut, 
  ChevronRight,
  Shield,
  CreditCard
} from 'lucide-react';
import { auth } from '../../services/firebase/config';
import { signOut } from 'firebase/auth';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Account: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success('লগআউট সফল হয়েছে!');
      navigate('/login');
    } catch (error) {
      toast.error('লগআউট করা যায়নি।');
    }
  };

  const menuItems = [
    { label: 'আমার অর্ডার', icon: Package, to: '/my-orders', desc: 'অর্ডারের অবস্থা চেক করুন' },
    { label: 'ডেলিভারি ঠিকানা', icon: MapPin, to: '#', desc: 'আপনার ঠিকানা পরিবর্তন করুন' },
    { label: 'অ্যাকাউন্ট সেটিংস', icon: Settings, to: '#', desc: 'প্রোফাইল আপডেট করুন' },
    { label: 'পেমেন্ট মেথড', icon: CreditCard, to: '#', desc: 'কার্ড ও ওয়ালেট ম্যানেজ করুন' },
    { label: 'নিরাপত্তা', icon: Shield, to: '#', desc: 'পাসওয়ার্ড পরিবর্তন করুন' },
  ];

  return (
    <div className="py-12 md:py-20 bg-gray-50 dark:bg-gray-900/50 min-h-screen">
      <Helmet>
        <title>আমার অ্যাকাউন্ট - মাহমুদ টেলিকম</title>
      </Helmet>

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12">
          <div className="relative">
            <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-blue-800 p-1">
              <img 
                src={`https://ui-avatars.com/api/?name=${user?.displayName || 'User'}&background=random&size=128`} 
                alt="Profile" 
                className="w-full h-full rounded-[2.2rem] object-cover border-4 border-white dark:border-gray-800"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-gray-800" />
          </div>
          <div className="text-center md:text-left flex-1">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{user?.displayName || 'User Name'}</h1>
            <p className="text-gray-500 mb-6">{user?.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl text-xs font-bold uppercase tracking-widest">
                Verified Customer
              </span>
              <span className="px-4 py-2 bg-gray-200 dark:bg-gray-800 text-gray-500 rounded-xl text-xs font-bold uppercase tracking-widest">
                Member Since 2024
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {menuItems.map((item, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link 
                to={item.to}
                className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all group"
              >
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900 text-gray-400 group-hover:text-blue-600 group-hover:bg-blue-50 transition-colors">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="ml-6 flex-1">
                  <h3 className="font-bold text-gray-900 dark:text-white">{item.label}</h3>
                  <p className="text-xs text-gray-400">{item.desc}</p>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-blue-600 transition-colors" />
              </Link>
            </motion.div>
          ))}

          <button 
            onClick={handleLogout}
            className="flex items-center p-6 bg-white dark:bg-gray-800 rounded-[2rem] border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-xl hover:shadow-red-500/5 transition-all group text-left w-full"
          >
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-500">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="ml-6 flex-1">
              <h3 className="font-bold text-red-500">লগআউট</h3>
              <p className="text-xs text-gray-400">অ্যাকাউন্ট থেকে বের হয়ে যান</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-red-500 transition-colors" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
