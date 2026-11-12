import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { SupportedLanguage } from '@hotel-os/shared';

interface UiState {
  lang: SupportedLanguage;
  setLang: (lang: SupportedLanguage) => void;
}

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      lang: 'en',
      setLang: (lang) => set({ lang }),
    }),
    {
      name: 'hotel-os-ui',
    }
  )
);

