import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { paymentApi, extractErrorMessage } from '../../api/axios';

// Maps 1:1 to Payment/src/routes/payment.routes.js
// Flow: createPayment(orderId) -> returns Razorpay order -> open Razorpay Checkout
// -> on success call verifyPayment({ paymentId, signature, razorpayOrderId })

export const createPayment = createAsyncThunk(
  'payment/create',
  async (orderId, { rejectWithValue }) => {
    try {
      const { data } = await paymentApi.post(`/create/${orderId}`);
      return data.payment;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const verifyPayment = createAsyncThunk(
  'payment/verify',
  async ({ paymentId, signature, razorpayOrderId }, { rejectWithValue }) => {
    try {
      const { data } = await paymentApi.post('/verify', {
        paymentId,
        signature,
        razorpayOrderId,
      });
      return data.payment;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  payment: null,
  status: 'idle', // idle | creating | awaiting-checkout | verifying | verified | failed
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    resetPayment(state) {
      state.payment = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.status = 'creating';
        state.error = null;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.status = 'awaiting-checkout';
        state.payment = action.payload;
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(verifyPayment.pending, (state) => {
        state.status = 'verifying';
      })
      .addCase(verifyPayment.fulfilled, (state, action) => {
        state.status = 'verified';
        state.payment = action.payload;
      })
      .addCase(verifyPayment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
