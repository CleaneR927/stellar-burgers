import { combineReducers, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import feedsReducer from './feeds/feedsSlice';
import ingredientsReducer from './ingredients/ingredientsSlice';
import orderReducer from './order/orderSlice';
import burgerConstructorReducer from './burgerConstructor/burgerConstructorSlice';
import userDataReducer from './userData/userDataSlice';

export const rootReducer = combineReducers({
  burgerConstructor: burgerConstructorReducer,
  feeds: feedsReducer,
  ingredients: ingredientsReducer,
  order: orderReducer,
  userData: userDataReducer
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
