import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredientsThunk } from './ingredientsAction';

export interface IngredientsState {
  ingredients: TIngredient[];
  isIngredientsLoading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
};
// Задача редьюсера - отслеживать состояние загрузки, хранения и обработки ингредиентов в приложении, упрощая управление состоянием
const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  // Селекторы для доступа к массиву ингредиентов и текущего состояния загрузки
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    isIngredientsLoadingSelector: (state) => state.isIngredientsLoading
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.isIngredientsLoading = true;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.isIngredientsLoading = false;
        state.error = action.error.message!;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.isIngredientsLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { ingredientsSelector, isIngredientsLoadingSelector } =
  ingredientsSlice.selectors;
export default ingredientsSlice.reducer;
