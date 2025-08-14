import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SearchState {
  recentSearches: string[];
  popularStocks: string[];
}

const initialState: SearchState = {
  recentSearches: [],
  popularStocks: ['AAPL', 'GOOGL', 'MSFT', 'SPOT'],
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    addRecentSearch: (state, action: PayloadAction<string>) => {
      const query = action.payload.trim();
      if (query) {
        // Remove existing occurrence and add to beginning
        state.recentSearches = state.recentSearches.filter(s => s !== query);
        state.recentSearches.unshift(query);
        // Keep only the last 5 searches
        state.recentSearches = state.recentSearches.slice(0, 5);
      }
    },
    clearRecentSearches: state => {
      state.recentSearches = [];
    },
    setPopularStocks: (state, action: PayloadAction<string[]>) => {
      state.popularStocks = action.payload;
    },
    loadRecentSearches: (state, action: PayloadAction<string[]>) => {
      state.recentSearches = action.payload;
    },
  },
});

export const {
  addRecentSearch,
  clearRecentSearches,
  setPopularStocks,
  loadRecentSearches,
} = searchSlice.actions;

export default searchSlice.reducer;
