import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { TConstructorIngredient, TIngredient } from '../../utils/types';
import { v4 as uuidv4 } from 'uuid';

export interface IBurgerConstructorState {
  burgerConstructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  error: string | null;
}

const initialState: IBurgerConstructorState = {
  burgerConstructor: {
    bun: null,
    ingredients: []
  },
  error: null
};
// Задача редюсера - обновление состояния конструктора бургера в ответ на действия, касающиеся ингредиентов
const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  selectors: {
    burgerConstructorSelector: (state) => state.burgerConstructor
  },
  reducers: {
    addIngredient: {
      // Если ингредиент является булкой, он заменяет текущую булку; если нет, он добавляется в массив ингредиентов
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burgerConstructor.bun = action.payload;
        } else {
          state.burgerConstructor.ingredients.push(action.payload);
        }
      },
      // Генерирует уникальный ID для каждого ингредиента
      prepare: (ingredient: TIngredient) => {
        const id = uuidv4();
        return { payload: { ...ingredient, id } };
      }
    },
    // Перемещают ингредиенты вверх или вниз в списке, используя их индекс
    upIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burgerConstructor.ingredients;
      const index = action.payload;
      array.splice(index - 1, 0, array.splice(index, 1)[0]);
    },
    downIngredient: (state, action: PayloadAction<number>) => {
      const array = state.burgerConstructor.ingredients;
      const index = action.payload;
      array.splice(index + 1, 0, array.splice(index, 1)[0]);
    },
    // Удаляет заданный ингредиент из массива по его ID
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.burgerConstructor.ingredients =
        state.burgerConstructor.ingredients.filter(
          (ingredient) => ingredient.id !== action.payload.id
        );
    },
    // Очищает состояние конструктора, возвращая его к начальному состоянию
    clearBurgerConstructor: (state) => {
      state.burgerConstructor.bun = null;
      state.burgerConstructor.ingredients = [];
    }
  }
});

export const { burgerConstructorSelector } = burgerConstructorSlice.selectors;
export const {
  addIngredient,
  upIngredient,
  downIngredient,
  removeIngredient,
  clearBurgerConstructor
} = burgerConstructorSlice.actions;
export default burgerConstructorSlice.reducer;
