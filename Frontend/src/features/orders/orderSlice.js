import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { orderApi, extractErrorMessage } from '../../api/axios';

// Maps 1:1 to Order/src/routes/order.routes.js
// createOrder body validated with addUserAddressValidation -> expects a shippingAddress

export const createOrder = createAsyncThunk(
  'orders/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.post('/', payload);
      return data.order ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchMyOrders = createAsyncThunk(
  'orders/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.get('/me');
      return data.orders ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'orders/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.get(`/${id}`);
      return data.order ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const cancelOrder = createAsyncThunk(
  'orders/cancel',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.get(`/${id}/cancel`);
      return data.order ?? { _id: id, status: 'CANCELLED' };
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateOrderAddress = createAsyncThunk(
  'orders/updateAddress',
  async ({ id, address }, { rejectWithValue }) => {
    try {
      const { data } = await orderApi.patch(`/${id}/address`, address);
      return data.order ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  orders: [],
  current: null,
  status: 'idle',
  error: null,
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.orders = action.payload;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.current = action.payload;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
        state.current = action.payload;
      })
      .addMatcher(
        (action) =>
          [cancelOrder.fulfilled.type, updateOrderAddress.fulfilled.type].includes(action.type),
        (state, action) => {
          const updated = action.payload;
          state.orders = state.orders.map((o) => (o._id === updated._id ? { ...o, ...updated } : o));
          if (state.current?._id === updated._id) state.current = { ...state.current, ...updated };
        }
      )
      .addMatcher(
        (action) => action.type.startsWith('orders/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.status = 'failed';
          state.error = action.payload;
        }
      );
  },
});

export default orderSlice.reducer;
