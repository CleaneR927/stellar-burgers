import { orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
// Асинхронный экшн для отправки заказа на сервер
export const orderBurgerThunk = createAsyncThunk(
  'orders/postOrderBurger',
  async (order: string[]) => orderBurgerApi(order)
);
