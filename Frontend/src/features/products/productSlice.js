import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { productApi, extractErrorMessage } from '../../api/axios';

// Maps 1:1 to Product/src/routes/product.routes.js

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      // Product/src/controllers/product.controller.js -> getProducts responds { message, data }
      const { data } = await productApi.get('/', { params });
      return data.data ?? [];
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productApi.get(`/${id}`);
      return data.product ?? data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const fetchMyProducts = createAsyncThunk(
  'products/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      // getProductBySeller responds { data: [...] }
      const { data } = await productApi.get('/seller');
      return data.data ?? [];
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

// payload: a FormData instance built by the caller. Fields must be FLAT
// (matches Product/src/middlewares/validator.middleware.js + controller):
//   title, description, priceAmount, priceCurrency, category, images[] (multer .array('images'))
// NOTE: stock is not accepted on create (defaults to 0 in the schema); it can
// only be set afterwards via updateProduct.
export const createProduct = createAsyncThunk(
  'products/create',
  async (formData, { rejectWithValue }) => {
    try {
      // createProduct responds { message, data: product }
      const { data } = await productApi.post('/', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.data;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/update',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      // updateProduct responds { product } (different shape than create!)
      const { data } = await productApi.patch(`/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return data.product;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/delete',
  async (id, { rejectWithValue }) => {
    try {
      await productApi.delete(`/${id}`);
      return id;
    } catch (err) {
      return rejectWithValue(extractErrorMessage(err));
    }
  }
);

const initialState = {
  items: [],
  myProducts: [],
  current: null,
  status: 'idle',
  error: null,
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.current = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.status = 'loading';
        state.current = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.current = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(fetchMyProducts.fulfilled, (state, action) => {
        state.myProducts = action.payload;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.myProducts.unshift(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.myProducts = state.myProducts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.myProducts = state.myProducts.filter((p) => p._id !== action.payload);
      });
  },
});

export const { clearCurrentProduct } = productSlice.actions;
export default productSlice.reducer;
