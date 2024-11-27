import { getIngredientsThunk } from '../src/services/ingredients/ingredientsAction';
import ingredientsReducer from '../src/services/ingredients/ingredientsSlice';

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const initialState = {
  ingredients: [],
  isIngredientsLoading: false,
  error: null
}

describe('Проверка работы "ingredientsReducer"', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Сбрасываем все мок-значения перед каждым тестом
  });

  test('Тест вызова "getIngredientsThunk" с состоянием "pending"', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = ingredientsReducer( initialState, action );
    expect(state.isIngredientsLoading).toBeTruthy();
  });

  test('Тест вызова "getIngredientsThunk" с состоянием "rejected"', () => {
    const action = {
      type: getIngredientsThunk.rejected.type,
      error: { message: 'error fetching ingredients' }
    };
    const state = ingredientsReducer( initialState, action );
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe(action.error.message);
  });

  test('Тест вызова "getIngredientsThunk" с состоянием "fulfilled"', () => {
    const action = {
      type: getIngredientsThunk.fulfilled.type,
      payload: [
        { id: 1, name: 'testIngredient'}, 
        { id: 2, name: 'testIngredient2'}
      ]
    };
    const state = ingredientsReducer( initialState, action );
    expect(state.isIngredientsLoading).toBeFalsy();
    expect(state.ingredients).toEqual(action.payload);
  });
});
