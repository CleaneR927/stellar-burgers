import { orderBurgerThunk } from '../src/services/order/orderAction';
import orderReducer, { clearOrder } from '../src/services/order/orderSlice';

jest.mock('@api', () => ({
  orderBurgerApi: jest.fn()
}));

export const orderMockData = {
  ingredients: [
    '643d69a5c3f7b9001cfa093d',
    '643d69a5c3f7b9001cfa0941',
    '643d69a5c3f7b9001cfa093d'
  ],
  _id: '6622337897ede0001d0666b5',
  status: 'done',
  name: 'testOrder',
  createdAt: '2024-04-19T09:03:52.748Z',
  updatedAt: '2024-04-19T09:03:58.057Z',
  number: 42177
};

describe('Проверка работы "orderReducer"', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем моки перед каждым тестом
  });

  const initialState = {
    order: null,
    isOrderLoading: false,
    error: null
  };

  test('Тест работы редьюсера "clearOrder" для очистки состояния', () => {
    const changeState = {
      ...initialState,
      order: orderMockData
    }
    const state = orderReducer(changeState, clearOrder());
    expect(state.order).toBeNull();
    expect(state.isOrderLoading).toBeFalsy();
  });

  describe('Тест вызова "orderBurgerThunk"', () => {
    test('Тест вызова "orderBurgerThunk" с состоянием "pending"', () => {
      const action = { type: orderBurgerThunk.pending.type };
      const state = orderReducer(initialState, action);
      expect(state.isOrderLoading).toBeTruthy();
    });

    test('Тест вызова "orderBurgerThunk" с состоянием "rejected"', () => {
      const action = {
        type: orderBurgerThunk.rejected.type,
        error: { message: 'error fetching order' }
      };
      const state = orderReducer(initialState, action);
      expect(state.isOrderLoading).toBeFalsy();
      expect(state.error).toBe(action.error.message);
    });

    test('Тест вызова "orderBurgerThunk" с состоянием "fulfilled"', () => {
      const action = {
        type: orderBurgerThunk.fulfilled.type,
        payload: { order: orderMockData }
      };
      const state = orderReducer(initialState, action);
      expect(state.isOrderLoading).toBeFalsy();
      expect(state.order).toEqual(action.payload.order);
    });
  })
});
