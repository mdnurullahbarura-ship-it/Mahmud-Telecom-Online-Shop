import React, { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { 
  Upload, 
  Image as ImageIcon, 
  Store, 
  Phone, 
  MessageSquare, 
  MapPin, 
  Mail, 
  Save, 
  RotateCcw,
  AlertCircle
} from 'lucide-react';
import { useSettingsStore, DEFAULT_SETTINGS } from '../../../store/useSettingsStore';
import toast from 'react-hot-toast';

const AdminSettings: React.FC = () => {
  const { settings, updateSettings, loadSettings } = useSettingsStore();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  useEffect(() => {
    setFormData(settings);
  }, [settings]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'logoUrl') setPreviewError(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('সঠিক ছবি নির্বাচন করুন (JPG/PNG)');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('ছবি ২MB এর কম সাইজের হতে হবে');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Url = event.target?.result as string;
      setFormData((prev) => ({ ...prev, logoUrl: base64Url }));
      setPreviewError(false);
      toast.success('লোগো লোড হয়েছে! সংরক্ষণ করতে নিচের বাটনে ক্লিক করুন।');
    };
    reader.readAsDataURL(file);
  };

  const handleResetLogo = () => {
    setFormData((prev) => ({ ...prev, logoUrl: DEFAULT_SETTINGS.logoUrl }));
    setPreviewError(false);
    toast('ডিফল্ট লোগোতে ফিরিয়ে নেওয়া হয়েছে');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateSettings(formData);
      toast.success('লোগো এবং সেটিংস সফলভাবে সেভ হয়েছে!');
    } catch (err) {
      toast.error('সেটিংস সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      <Helmet>
        <title>দোকানের সেটিংস ও লোগো - মাহমুদ টেলিকম</title>
      </Helmet>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white flex items-center space-x-3">
          <Store className="w-8 h-8 text-blue-600" />
          <span>দোকানের সেটিংস ও লোগো পরিবর্তন</span>
        </h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          এখানে আপনার দোকানের লোগো, নাম, ঠিকানা ও যোগাযোগের তথ্য পরিবর্তন করতে পারেন।
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-lg font-bold text-gray-900 dark:text-white">
            <ImageIcon className="w-5 h-5 text-blue-600" />
            <span>দোকানের লোগো (Shop Logo)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="flex flex-col items-center justify-center p-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700">
              <div className="w-28 h-28 rounded-2xl overflow-hidden shadow-md bg-white dark:bg-gray-900 flex items-center justify-center border border-gray-200 dark:border-gray-700">
                {previewError || !formData.logoUrl ? (
                  <div className="flex flex-col items-center justify-center p-2 text-center text-xs text-gray-400">
                    <AlertCircle className="w-8 h-8 text-amber-500 mb-1" />
                    <span>লোগো খালি</span>
                  </div>
                ) : (
                  <img 
                    src={formData.logoUrl} 
                    alt="Logo Preview" 
                    className="w-full h-full object-contain p-2"
                    onError={() => setPreviewError(true)}
                  />
                )}
              </div>
              <span className="text-xs text-gray-400 font-medium mt-3">বর্তমান লোগো প্রিভিউ</span>
            </div>

            <div className="md:col-span-2 space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  ১. সরাসরি মোবাইল/কম্পিউটার থেকে ছবি আপলোড করুন
                </label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp, image/svg+xml"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center space-x-2 shadow-md shadow-blue-500/20 cursor-pointer"
                  >
                    <Upload className="w-4 h-4" />
                    <span>গ্যালারি থেকে নতুন লোগো বেছে নিন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetLogo}
                    className="px-4 py-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 text-gray-600 dark:text-gray-300 rounded-xl font-semibold text-xs flex items-center space-x-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>ডিফল্ট লোগো</span>
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">
                  ২. অথবা লোগো ছবির সরাসরি ওয়েব লিংক দিন
                </label>
                <input 
                  type="url"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleInputChange}
                  placeholder="https://example.com/my-logo.png"
                  className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-900 rounded-3xl p-6 md:p-8 border border-gray-100 dark:border-gray-800 shadow-sm space-y-6">
          <div className="flex items-center space-x-2 text-lg font-bold text-gray-900 dark:text-white">
            <Store className="w-5 h-5 text-blue-600" />
            <span>দোকানের বিবরণ ও যোগাযোগের তথ্য</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">দোকানের নাম</label>
              <input 
                type="text"
                name="shopName"
                required
                value={formData.shopName}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">স্লোগান / ট্যাগলাইন</label>
              <input 
                type="text"
                name="tagline"
                value={formData.tagline}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">ফোন নম্বর</label>
              <input 
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">হোয়াটসঅ্যাপ নম্বর</label>
              <input 
                type="text"
                name="whatsapp"
                value={formData.whatsapp}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-2">দোকানের ঠিকানা</label>
              <input 
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full h-12 px-4 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 text-white rounded-2xl font-bold text-base shadow-xl shadow-blue-500/25 flex items-center space-x-2.5 cursor-pointer"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>পরিবর্তন সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettings;
