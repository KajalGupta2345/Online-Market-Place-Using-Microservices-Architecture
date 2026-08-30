import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { cartApi, extractErrorMessage } from '../../api/axios';

// Maps 1:1 to Cart/src/routes/cart.routes.js

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const { data } = await cartApi.get('/items');
    return data.cart ?? data;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

export const addItemToCart = createAsyncThunk(
  'cart/addItem',
  async ({ productId, quantity = 1 }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.post('/items', { productId, quantity });
      return data.cart ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateItem',
  async ({ productId, quantity }, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.patch(`/items/${productId}`, { quantity });
      return data.cart ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const removeCartItem = createAsyncThunk(
  'cart/removeItem',
  async (productId, { rejectWithValue }) => {
    try {
      const { data } = await cartApi.delete(`/items/${productId}`);
      return data.cart ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue }) => {
  try {
    await cartApi.delete('/items');
    return true;
  } catch (err) {
    return rejectWithValue(extractErrorMessage(err));
  }
});

const initialState = {
  cart: { items: [] },
  status: 'idle',
  error: null,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = { items: [] };
      })
      .addMatcher(
        (action) =>
          [
            fetchCart.fulfilled.type,
            addItemToCart.fulfilled.type,
            updateCartItem.fulfilled.type,
            removeCartItem.fulfilled.type,
          ].includes(action.type),
        (state, action) => {
          state.status = 'succeeded';
          state.cart = action.payload;
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export default cartSlice.reducer;