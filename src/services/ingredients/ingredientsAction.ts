import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
// Асинхронный экшн для получения массива ингридиентов с сервера
export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  async () => getIngredientsApi()
);
