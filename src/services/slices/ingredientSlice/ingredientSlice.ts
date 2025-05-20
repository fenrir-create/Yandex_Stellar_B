import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../../utils/burger-api';
import { TIngredient } from '@utils-types';

// Тип состояния для ингредиентов
type TIngredientsState = {
  list: TIngredient[];
  isFetching: boolean;
  fetchError: string | null;
};

// Начальное состояние
const initialIngredientsState: TIngredientsState = {
  list: [],
  isFetching: false,
  fetchError: null
};

// Thunk для загрузки данных об ингредиентах
export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async (_, thunkAPI) => {
    try {
      return await getIngredientsApi();
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// Создание слайса ингредиентов
const ingredientsDataSlice = createSlice({
  name: 'ingredientsData',
  initialState: initialIngredientsState,
  reducers: {},
  selectors: {
    selectIngredientsState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.isFetching = true;
        state.fetchError = null;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.isFetching = false;
        state.list = action.payload;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.isFetching = false;
        state.fetchError = action.payload as string;
      });
  }
});

// Экспорт селектора
export const { selectIngredientsState } = ingredientsDataSlice.selectors;

// Экспорт редьюсера
export default ingredientsDataSlice.reducer;
