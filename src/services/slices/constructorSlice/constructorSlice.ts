import { createSlice, createAsyncThunk, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';

type TBurgerBuilderState = {
  isLoading: boolean;
  requestInProgress: boolean;
  selectedItems: {
    bun: TConstructorIngredient | null;
    fillings: TConstructorIngredient[];
  };
  orderDetails: TOrder | null;
  errorMessage: string | null;
};

const initialBuilderState: TBurgerBuilderState = {
  isLoading: false,
  requestInProgress: false,
  selectedItems: {
    bun: null,
    fillings: []
  },
  orderDetails: null,
  errorMessage: null
};

// Async thunk для отправки заказа
export const submitBurgerOrder = createAsyncThunk(
  'builder/submitOrder',
  async (ingredientIds: string[], thunkAPI) => {
    try {
      const response = await orderBurgerApi(ingredientIds);
      return response;
    } catch (error) {
      return thunkAPI.rejectWithValue((error as Error).message);
    }
  }
);

const burgerBuilderSlice = createSlice({
  name: 'burgerBuilder',
  initialState: initialBuilderState,
  reducers: {
    addItem: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.selectedItems.bun = action.payload;
        } else {
          state.selectedItems.fillings.push(action.payload);
        }
      },
      prepare: (item: TIngredient) => {
        return { payload: { ...item, id: nanoid() } };
      }
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.selectedItems.fillings = state.selectedItems.fillings.filter(
        (ingredient) => ingredient.id !== action.payload
      );
    },

    moveItemUp: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index > 0) {
        const temp = state.selectedItems.fillings[index - 1];
        state.selectedItems.fillings[index - 1] = state.selectedItems.fillings[index];
        state.selectedItems.fillings[index] = temp;
      }
    },

    moveItemDown: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (index < state.selectedItems.fillings.length - 1) {
        const temp = state.selectedItems.fillings[index + 1];
        state.selectedItems.fillings[index + 1] = state.selectedItems.fillings[index];
        state.selectedItems.fillings[index] = temp;
      }
    },

    clearOrderData: (state) => {
      state.orderDetails = null;
    },

    setRequestState: (state, action: PayloadAction<boolean>) => {
      state.requestInProgress = action.payload;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(submitBurgerOrder.pending, (state) => {
        state.isLoading = true;
        state.requestInProgress = true;
        state.errorMessage = null;
      })
      .addCase(submitBurgerOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requestInProgress = false;
        state.orderDetails = action.payload.order;
        state.selectedItems = {
          bun: null,
          fillings: []
        };
      })
      .addCase(submitBurgerOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.requestInProgress = false;
        state.errorMessage = action.payload as string;
      });
  }
});

// Экспорт экшенов
export const {
  addItem,
  removeItem,
  moveItemUp,
  moveItemDown,
  clearOrderData,
  setRequestState
} = burgerBuilderSlice.actions;

// Селектор
export const selectBurgerBuilder = (state: { burgerBuilder: TBurgerBuilderState }) =>
  state.burgerBuilder;

// Экспорт редьюсера
export default burgerBuilderSlice.reducer;
