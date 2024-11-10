import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import feeds from './feeds/feedsSlice';
import ingredients from './ingredients/ingredientsSlice';
import order from './order/orderSlice';
import burgerConstructor from './burgerConstructor/burgerConstructorSlice';
import userData from './userData/userDataSlice';

export const rootReducer = combineReducers({
  burgerConstructor,
  feeds,
  ingredients,
  order,
  userData
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>; // для получения типа store

export type AppDispatch = typeof store.dispatch; // для совпадения типов из store

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
