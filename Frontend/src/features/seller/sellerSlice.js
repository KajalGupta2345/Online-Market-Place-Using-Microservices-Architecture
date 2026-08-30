import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { sellerApi, extractErrorMessage } from '../../api/axios';

// Maps 1:1 to seller/src/routes/seller.routes.js

export const fetchSellerMetrics = createAsyncThunk(
  'seller/metrics',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await sellerApi.get('/metrics');
      return data.metrics ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchSellerOrders = createAsyncThunk(
  'seller/orders',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await sellerApi.get('/orders');
      return data.orders ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchSellerProducts = createAsyncThunk(
  'seller/products',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await sellerApi.get('/products');
      return data.products ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  metrics: null,
  orders: [],
  products: [],
  status: 'idle',
  error: null,
};

const sellerSlice = createSlice({
  name: 'sellerDashboard',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSellerMetrics.fulfilled, (state, action) => {
        state.metrics = action.payload;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchSellerProducts.fulfilled, (state, action) => {
        state.products = action.payload;
      })
      .addMatcher(
        (action) => action.type.startsWith('seller/') && action.type.endsWith('/pending'),
        (state) => {
          state.status = 'loading';
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('seller/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export default sellerSlice.reducer;
