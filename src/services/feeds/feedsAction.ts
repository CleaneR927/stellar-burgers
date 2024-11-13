import { getFeedsApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
// Асинхронный экшн для получения заказов
export const getFeedsThunk = createAsyncThunk('feeds/getFeeds', async () =>
  getFeedsApi()
);
// Асинхронный экшн на получение данных конкретного заказа по его номеру
export const getOrderByNumberThunk = createAsyncThunk(
  'orders/getOrder',
  async (number: number) => getOrderByNumberApi(number)
);
