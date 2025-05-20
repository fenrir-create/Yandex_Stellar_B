import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

// Тип состояния для деталей заказа
type TOrderDetailsState = {
  selectedOrder: TOrder | null;
  isLoading: boolean;
  errorMessage: string | null;
};

// Начальное состояние
const initialState: TOrderDetailsState = {
  selectedOrder: null,
  isLoading: false,
  errorMessage: null
};

// Thunk-запрос заказа по номеру
export const fetchOrderDetails = createAsyncThunk(
  'orderDetails/fetchByNumber',
  async (orderNumber: number, thunkAPI) => {
    try {
      const data = await getOrderByNumberApi(orderNumber);
      return data.orders[0]; // первый (и единственный) заказ
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

// Слайс для хранения данных о заказе по номеру
const orderDetailsSlice = createSlice({
  name: 'orderDetails',
  initialState,
  reducers: {},
  selectors: {
    selectOrderDetails: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrderDetails.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      });
  }
});

// Экспорт селектора
export const { selectOrderDetails } = orderDetailsSlice.selectors;

// Экспорт редьюсера
export default orderDetailsSlice.reducer;
