import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { authApi, extractErrorMessage } from '../../api/axios';
import { setToken, clearToken, getToken } from '../../api/tokenStorage';

// Maps 1:1 to Auth/src/routes/auth.routes.js

export const registerUser = createAsyncThunk(
  'auth/register',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.post('/register', payload);
      setToken(data.token);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const loginUser = createAsyncThunk(
  'auth/login',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await authApi.post('/login', payload);
      setToken(data.token);
      return data.user;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/me',
  async (_, { rejectWithValue }) => {
    if (!getToken()) {
      return rejectWithValue('no token');
    }
    try {
      const { data } = await authApi.get('/me');
      return data.user ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await authApi.get('/logout');
    } catch (err) {
      // Still clear the local session even if the backend call fails
      // (e.g. network issue) — falling through to clearToken() below.
    }
    clearToken();
    return true;
  }
);

export const fetchAddresses = createAsyncThunk(
  'auth/fetchAddresses',
  async (_, { rejectWithValue }) => {
    try {
      // Auth/src/controllers/auth.controller.js -> getUserAddress responds { address: [...] } (singular key!)
      const { data } = await authApi.get('/user/me/addresses');
      return data.address ?? [];
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const addAddress = createAsyncThunk(
  'auth/addAddress',
  async (address, { rejectWithValue }) => {
    try {
      // addUserAddress responds { address: [...] } (singular key, full updated list)
      const { data } = await authApi.post('/user/me/addresses', address);
      return data.address ?? [];
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteAddress = createAsyncThunk(
  'auth/deleteAddress',
  async (addressId, { rejectWithValue }) => {
    try {
      await authApi.delete(`/user/me/addresses/${addressId}`);
      return addressId;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  user: null,
  addresses: [],
  status: 'idle', // idle | loading | succeeded | failed
  bootstrapped: false, // whether we've checked /me at least once
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
        state.bootstrapped = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.status = 'idle';
        state.user = null;
        state.bootstrapped = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.addresses = [];
      })
      .addCase(logoutUser.rejected, (state) => {
        // Even if the backend call fails (e.g. network issue), clear the
        // client-side session so the UI doesn't get stuck "logged in".
        state.user = null;
        state.addresses = [];
      })
      .addCase(fetchAddresses.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(addAddress.fulfilled, (state, action) => {
        state.addresses = action.payload;
      })
      .addCase(deleteAddress.fulfilled, (state, action) => {
        state.addresses = state.addresses.filter((a) => a._id !== action.payload);
      });
  },
});

export const { clearAuthError } = authSlice.actions;
export default authSlice.reducer;
