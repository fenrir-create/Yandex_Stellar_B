import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../../utils/burger-api';
import { TOrder } from '@utils-types';

type TState = {
  items: TOrder[];
  totalCount: number;
  todayCount: number;
  isLoading: boolean;
  errorMessage: string | null;
};

// начальное состояние
export const initialFeedsState: TState = {
  items: [],
  totalCount: 0,
  todayCount: 0,
  isLoading: false,
  errorMessage: null
};

// thunk-запрос
export const fetchFeeds = createAsyncThunk(
  'feeds/fetchAll',
  async (_, thunkAPI) => {
    try {
      const data = await getFeedsApi();
      return data;
    } catch (err) {
      return thunkAPI.rejectWithValue((err as Error).message);
    }
  }
);

// слайс
const feedsSlice = createSlice({
  name: 'feedsData',
  initialState: initialFeedsState,
  reducers: {},
  selectors: {
    selectFeedState: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeeds.pending, (state) => {
        state.isLoading = true;
        state.errorMessage = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.orders;
        state.totalCount = action.payload.total;
        state.todayCount = action.payload.totalToday;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.isLoading = false;
        state.errorMessage = action.payload as string;
      });
  }
});

// селектор
export const { selectFeedState } = feedsSlice.selectors;
// export const selectFeeds = (state: { feedsData: TState }) => state.feedsData;

export default feedsSlice.reducer;
