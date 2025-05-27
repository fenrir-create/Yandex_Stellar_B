import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';
import { TIngredient } from '@utils-types';

// Тип состояния для ингредиентов
export type TIngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  errorMessage: string | null;
};

// Начальное состояние
export const initialState: TIngredientsState = {
  ingredients: [],
  isLoading: false,
  errorMessage: null
};

// Thunk для загрузки данных об ингредиентах
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetch',
  async (_, thunkAPI) => {
    try {
      const ingredients = await getIngredientsApi();
      return ingredients;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Создание слайса ингредиентов
export const ingredientSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    selectIngredientsState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      });
  }
});

// Экспорт селектора
export const { selectIngredientsState } = ingredientSlice.selectors;

// Экспорт редьюсера
export default ingredientSlice.reducer;
