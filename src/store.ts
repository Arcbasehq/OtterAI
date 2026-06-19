import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type SearchResult = {
  title: string;
  url: string;
  description: string;
};

type SearchState = {
  webSearchEnabled: boolean;
  searchResults: SearchResult[];
  isSearching: boolean;
  lastSearchQuery: string;
};

type SearchActions = {
  setWebSearchEnabled: (enabled: boolean) => void;
  setSearchResults: (results: SearchResult[]) => void;
  setIsSearching: (searching: boolean) => void;
  setLastSearchQuery: (query: string) => void;
  clearSearchResults: () => void;
};

export const useSearchStore = create<SearchState & SearchActions>()(
  persist(
    (set) => ({
      webSearchEnabled: false,
      searchResults: [],
      isSearching: false,
      lastSearchQuery: '',
      setWebSearchEnabled: (enabled) => set({
        webSearchEnabled: enabled,
        ...(enabled ? {} : { searchResults: [], lastSearchQuery: '' }),
      }),
      setSearchResults: (results) => set({ searchResults: results }),
      setIsSearching: (searching) => set({ isSearching: searching }),
      setLastSearchQuery: (query) => set({ lastSearchQuery: query }),
      clearSearchResults: () => set({ searchResults: [], lastSearchQuery: '' }),
    }),
    {
      name: 'otterai.search',
      partialize: (state) => ({ webSearchEnabled: state.webSearchEnabled }),
    },
  ),
);
