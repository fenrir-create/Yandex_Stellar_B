import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  TRegisterData,
  TLoginData,
  loginUserApi,
  registerUserApi,
  getUserApi,
  getOrdersApi,
  updateUserApi,
  logoutApi
} from '../../../utils/burger-api';
import { TUser, TOrder } from '@utils-types';
import { setCookie, deleteCookie } from '../../../utils/cookie';

// Тип состояния авторизации
type TAuthState = {
  currentUser: TUser | null;
  isLoading: boolean;
  errorMessage: string | null;
  isAuthenticated: boolean;
  isAuthChecked: boolean;
  orders: TOrder[];
};

// Начальное состояние
const initialState: TAuthState = {
  currentUser: null,
  isLoading: false,
  errorMessage: null,
  isAuthenticated: false,
  isAuthChecked: false,
  orders: []
};

// Регистрация
export const register = createAsyncThunk(
  'auth/register',
  async (formData: TRegisterData, thunkAPI) => {
    try {
      const response = await registerUserApi(formData);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Логин
export const login = createAsyncThunk(
  'auth/login',
  async (credentials: TLoginData, thunkAPI) => {
    try {
      const response = await loginUserApi(credentials);
      if (!response.success) {
        return thunkAPI.rejectWithValue('Login failed');
      }
      setCookie('accessToken', response.accessToken);
      localStorage.setItem('refreshToken', response.refreshToken);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Получение текущего пользователя
export const fetchUser = createAsyncThunk(
  'auth/fetchUser',
  async (_, thunkAPI) => {
    try {
      const response = await getUserApi();
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Обновление профиля
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: Partial<TRegisterData>, thunkAPI) => {
    try {
      const response = await updateUserApi(data);
      return response;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Получение заказов пользователя
export const fetchOrders = createAsyncThunk(
  'auth/fetchOrders',
  async (_, thunkAPI) => {
    try {
      const orders = await getOrdersApi();
      return orders;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Логаут
export const logout = createAsyncThunk('auth/logout', async () => {
  await logoutApi();
  localStorage.clear();
  deleteCookie('accessToken');
});

// Слайс авторизации
const userSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError(state) {
      state.errorMessage = null;
    },
    resetAuth(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isAuthChecked = false;
    }
  },
  selectors: {
    selectAuthState: (state) => state,
    selectAuthError: (state) => state.errorMessage
  },
  extraReducers: (builder) => {
    builder
      // Регистрация
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
        state.isAuthenticated = false;
      })

      // Логин
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
        state.isAuthenticated = false;
      })

      // Получение пользователя
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
        state.isAuthenticated = true;
        state.isAuthChecked = true;
      })
      .addCase(fetchUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.isAuthChecked = true;
        state.currentUser = null;
      })

      // Обновление профиля
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentUser = action.payload.user;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      })

      // Получение заказов
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      })

      // Логаут
      .addCase(logout.fulfilled, (state) => {
        state.currentUser = null;
        state.isAuthenticated = false;
        state.isAuthChecked = false;
        state.orders = [];
        state.errorMessage = null;
      });
  }
});

// Экспорт экшенов и селекторов
export const { clearError, resetAuth } = userSlice.actions;
export const { selectAuthState, selectAuthError } = userSlice.selectors;

// Экспорт редьюсера
export default userSlice.reducer;
