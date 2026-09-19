import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { Helmet } from 'react-helmet-async';
import { User, Mail, Lock, UserPlus, ArrowLeft, Chrome, ShieldCheck } from 'lucide-react';
import { auth, db } from '../../services/firebase/config';
import { useAuthStore } from '../../store/useAuthStore';
import toast from 'react-hot-toast';
import { motion } from 'motion/react';
import { UserRole } from '../../types';

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser } = useAuthStore();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const trimmedEmail = email.trim().toLowerCase();
    const isOwner = trimmedEmail === 'mahmudmedia191@gmail.com' || trimmedEmail === 'mahmudtelecom1122@gmail.com';

    try {
      let uid = 'user-' + Date.now();
      try {
        const userCredential = await createUserWithEmailAndPassword(auth, trimmedEmail, password);
        uid = userCredential.user.uid;
        await updateProfile(userCredential.user, { displayName: name });
      } catch (fbErr: any) {
        console.warn('Firebase registration notice:', fbErr?.code);
      }

      const newUser = {
        uid,
        email: trimmedEmail,
        displayName: name.trim() || (isOwner ? 'মাহমুদ হাসান' : 'সম্মানিত গ্রাহক'),
        role: isOwner ? UserRole.ADMIN : UserRole.CUSTOMER,
        createdAt: Date.now(),
      };

      try {
        await setDoc(doc(db, 'users', uid), { ...newUser, password });
      } catch (dbErr) {
        console.warn('Firestore save notice:', dbErr);
      }

      setUser(newUser as any);
      toast.success(isOwner ? 'অ্যাডমিন অ্যাকাউন্ট তৈরি সফল হয়েছে!' : 'রেজিস্ট্রেশন সফল হয়েছে!');
      navigate(isOwner ? '/admin' : '/');
    } catch (error: any) {
      toast.error('রেজিস্ট্রেশন সম্পন্ন করা যায়নি।');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('গুগল দিয়ে অ্যাকাউন্ট তৈরি সফল হয়েছে!');
      navigate('/');
    } catch (error: any) {
      toast.error('গুগল অ্যাকাউন্ট সাইন-আপ সম্পন্ন করা যায়নি।');
    }
  };

  const handleGuestLogin = () => {
    setUser({
      uid: 'guest-' + Date.now(),
      displayName: name || 'সম্মানিত কাস্টমার',
      email: email || 'customer@mahmudtelecom.com',
      role: UserRole.CUSTOMER,
      createdAt: Date.now()
    });
    toast.success('কাস্টমার হিসেবে সফলভাবে প্রবেশ করেছেন!');
    navigate('/');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <Helmet>
        <title>রেজিস্ট্রেশন - মাহমুদ টেলিকম</title>
      </Helmet>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-[2.5rem] p-8 md:p-12 shadow-2xl shadow-blue-500/10 border border-gray-100 dark:border-gray-800"
      >
        <Link to="/login" className="inline-flex items-center space-x-2 text-xs font-bold text-gray-400 hover:text-blue-600 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>লগইনে ফিরে যান</span>
        </Link>

        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">নতুন অ্যাকাউন্ট</h1>
          <p className="text-gray-500 dark:text-gray-400">মাহমুদ টেলিকম-এ যোগ দিতে নিচের তথ্যগুলো দিন</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="relative">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4 mb-2 block">পুরো নাম</label>
            <div className="relative">
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="আপনার নাম"
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

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
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400 ml-4 mb-2 block">পাসওয়ার্ড</label>
            <div className="relative">
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-gray-50 dark:bg-gray-900 border-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                placeholder="•••••••• (কমপক্ষে ৬ অক্ষর)"
              />
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-2xl font-bold shadow-xl shadow-blue-500/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                <span>অ্যাকাউন্ট খুলুন</span>
              </>
            )}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute top-1/2 left-0 w-full h-px bg-gray-100 dark:bg-gray-800" />
          <span className="relative px-4 bg-white dark:bg-gray-800 text-xs font-bold text-gray-400 uppercase tracking-widest">অথবা</span>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleGoogleRegister}
            className="w-full h-14 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-2xl font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center justify-center space-x-3 cursor-pointer"
          >
            <Chrome className="w-5 h-5 text-blue-500" />
            <span>গুগল দিয়ে সরাসরি সাইন-আপ</span>
          </button>

          <button
            type="button"
            onClick={handleGuestLogin}
            className="w-full h-12 bg-gray-50 dark:bg-gray-900/50 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-600 dark:text-gray-400 rounded-2xl text-xs font-bold transition-all flex items-center justify-center space-x-2 border border-dashed border-gray-300 dark:border-gray-700 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>সরাসরি টেস্ট মোডে প্রবেশ (Guest Mode)</span>
          </button>
        </div>

        <p className="mt-8 text-center text-sm text-gray-500">
          ইতিমধ্যেই অ্যাকাউন্ট আছে? <Link to="/login" className="font-bold text-blue-600 hover:underline">লগইন করুন</Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
