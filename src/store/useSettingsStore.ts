import { create } from 'zustand';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../services/firebase/config';

export interface SiteSettings {
  shopName: string;
  tagline: string;
  logoUrl: string;
  phone: string;
  whatsapp: string;
  address: string;
  email: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  shopName: 'মাহমুদ টেলিকম',
  tagline: 'সেরা মোবাইল, গ্যাজেট ও ইলেকট্রনিক্স শপ',
  logoUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=200&q=80',
  phone: '+880 1800-000000',
  whatsapp: '+880 1800-000000',
  address: 'বরুড়া বাজার, কুমিল্লা, বাংলাদেশ',
  email: 'mahmudmedia191@gmail.com',
};

interface SettingsState {
  settings: SiteSettings;
  loading: boolean;
  loadSettings: () => Promise<void>;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
}

const getStoredSettings = (): SiteSettings => {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem('mahmud_site_settings');
    if (raw) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.error('Error reading settings', e);
  }
  return DEFAULT_SETTINGS;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  settings: getStoredSettings(),
  loading: false,

  loadSettings: async () => {
    set({ loading: true });
    try {
      const docRef = doc(db, 'settings', 'site');
      const snap = await getDoc(docRef);
      if (snap.exists()) {
        const firestoreData = snap.data() as Partial<SiteSettings>;
        const merged = { ...DEFAULT_SETTINGS, ...firestoreData };
        if (typeof window !== 'undefined') {
          localStorage.setItem('mahmud_site_settings', JSON.stringify(merged));
        }
        set({ settings: merged, loading: false });
        return;
      }
    } catch (err) {
      console.warn('Using local fallback:', err);
    }
    set({ loading: false });
  },

  updateSettings: async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...get().settings, ...newSettings };
    if (typeof window !== 'undefined') {
      localStorage.setItem('mahmud_site_settings', JSON.stringify(updated));
    }
    set({ settings: updated });

    try {
      const docRef = doc(db, 'settings', 'site');
      await setDoc(docRef, updated, { merge: true });
    } catch (err) {
      console.warn('Save notice:', err);
    }
  },
}));
