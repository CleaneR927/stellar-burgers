import {
  TLoginData,
  TRegisterData,
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi
} from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { deleteCookie, setCookie } from '../../utils/cookie';
// Выполняет вход пользователя, сохраняет токены и возвращает данные пользователя
export const loginUserThunk = createAsyncThunk(
  'users/loginUser',
  async ({ email, password }: TLoginData) =>
    loginUserApi({ email, password }).then(
      ({ refreshToken, accessToken, user }) => {
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return user;
      }
    )
);
// Регистрация нового пользователя с сохранением токенов
export const registerUserThunk = createAsyncThunk(
  'users/registerUser',
  async ({ email, name, password }: TRegisterData) =>
    registerUserApi({ email, name, password }).then(
      ({ refreshToken, accessToken, user }) => {
        setCookie('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        return user;
      }
    )
);
// Деавторизовывает пользователя и удаляет токены
export const logoutUserThunk = createAsyncThunk('users/logoutUser', async () =>
  logoutApi().then(() => {
    deleteCookie('accessToken');
    localStorage.removeItem('refreshToken');
  })
);
// Получение данных пользователя
export const getUserThunk = createAsyncThunk('users/getUser', getUserApi);
// Обновление данных пользователя
export const updateUserThunk = createAsyncThunk(
  'users/updateUser',
  updateUserApi
);
// Получение заказов пользователя
export const getOrdersThunk = createAsyncThunk(
  'users/getUserOrders',
  getOrdersApi
);
