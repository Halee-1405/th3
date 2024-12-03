import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  searchQuery: '',
  currentPage: 1,
  itemsPerPage: 5,
};

const itemsSlice = createSlice({
  name: 'items',
  initialState,
  reducers: {
    addItem: (state, action) => {
      state.items.push(action.payload);
    },
    editItem: (state, action) => {
      const { index, updatedItem } = action.payload;
      state.items[index] = updatedItem;
    },
    deleteItem: (state, action) => {
      state.items.splice(action.payload, 1);
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { addItem, editItem, deleteItem, setSearchQuery, setCurrentPage } =
  itemsSlice.actions;
export default itemsSlice.reducer;