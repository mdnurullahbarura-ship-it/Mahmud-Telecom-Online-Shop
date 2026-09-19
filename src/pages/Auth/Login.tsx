/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { Helmet } from 'react-helmet-async';
import { Mail, Lock, LogIn, Chrome, AlertCircle } from 'lucide-react';
import { auth } from '../../services/firebase/config';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('লগইন সফল হয়েছে!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error(error.message || 'লগইন ব্যর্থ হয়েছে। তথ্য যাচাই করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('গুগল লগইন সফল হয়েছে!');
      navigate(from, { replace: true });
    } catch (error: any) {
      toast.error('গুগল লগইন ব্যর্থ হয়েছে।');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>লগইন - মাহমুদ টেলিকম</title>
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-500/10 border border-gray-100 dark:border-gray-800"
      >
        <div className="text-center mb-10">
          <img 
            src="/assets/aistudio/1786432871461.jpg" 
            alt="Logo" 
            className="w-16 h-16 rounded-2xl mx-auto mb-6 shadow-lg"
          />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">স্বাগতম</h1>
          <p className="text-gray-500 dark:text-gray-400">মাহমুদ টেলিকম-এ আপনার অ্যাকাউন্টে প্রবেশ করুন</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4 mb-2 block">ইমেইল</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="example@mail.com"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <div className="relative">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4 block">পাসওয়ার্ড</label>
              <Link to="/forgot-password" className="text-xs font-bold text-blue-600 hover:underline">পাসওয়ার্ড ভুলে গেছেন?</Link>
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="••••••••"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <LogIn className="w-5 h-5" />
                <span>লগইন করুন</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-10 text-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 dark:bg-gray-800" />
          <span className="relative px-4 bg-white dark:bg-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">অথবা</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center space-x-3"
        >
          <Chrome className="w-5 h-5 text-blue-500" />
          <span>গুগল দিয়ে লগইন</span>
        </button>

        <p className="mt-10 text-center text-sm text-gray-500">
          অ্যাকাউন্ট নেই? <Link to="/register" className="font-bold text-blue-600 hover:underline">নতুন অ্যাকাউন্ট খুলুন</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
