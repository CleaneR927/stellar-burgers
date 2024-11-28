import feedsReducer from '../src/services/feeds/feedsSlice';
import { getFeedsThunk, getOrderByNumberThunk } from '../src/services/feeds/feedsAction';

jest.mock('@api', () => ({
  getFeedsApi: jest.fn(),
  getOrderByNumberApi: jest.fn(),
}));

const initialState = {
  orders: [],
  isFeedsLoading: false,
  order: null,
  isOrderLoading: false,
  total: 0,
  totalToday: 0,
  error: null,
}

describe('Проверка работы "feedsReducer"', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем моки перед каждым тестом
  });

  describe('Тест вызова "getFeedsThunk"', () => {
    test('Тест вызова "getFeedsThunk" с состоянием "pending"', () => {
      const action = { type: getFeedsThunk.pending.type }; // type определяет тип действия
      const state = feedsReducer({...initialState}, action);
      expect(state.isFeedsLoading).toBeTruthy();
    });
  
    test('Тест вызова "getFeedsThunk" с состоянием "rejected"', () => {
      const action = {  
        type: getFeedsThunk.rejected.type,
        error: { message: 'error fetching feeds' } // error помогает обработать ошибки, возникшие во время выполнения действия
       };
      const state = feedsReducer({...initialState}, action);
      expect(state.isFeedsLoading).toBeFalsy();
      expect(state.error).toBe(action.error.message);
    });
  
    test('Тест вызова "getFeedsThunk" с состоянием "fulfilled"', () => {
      const action = { 
        type: getFeedsThunk.fulfilled.type, 
        payload: { // payload содержит полезные данные для обновления состояния
          orders: [{ id:1, name: 'testItem'}, { id:2, name: 'testItem2'}], 
          total: 2, 
          totalToday: 2 
        } 
      };
      const state = feedsReducer({...initialState}, action);
      expect(state.isFeedsLoading).toBeFalsy();
      expect(state.orders).toEqual(action.payload.orders);
      expect(state.total).toEqual(action.payload.total);
      expect(state.totalToday).toEqual(action.payload.totalToday);
    });
  });
  describe('Тест вызова "getOrderByNumberThunk"', () => {
    test('Тест вызова "getOrderByNumberThunk" с состоянием "pending"', () => {
      const action = { type: getOrderByNumberThunk.pending.type };
      const state = feedsReducer({...initialState}, action);
      expect(state.isOrderLoading).toBeTruthy();
    })
    test('Тест вызова "getOrderByNumberThunk" с состоянием "rejected"', () => {
      const action = {
        type: getOrderByNumberThunk.rejected.type,
        error: { message: 'error fetching order' }
      };
      const state = feedsReducer({...initialState}, action);
      expect(state.isOrderLoading).toBeFalsy();
      expect(state.error).toBe(action.error.message);
    })
    test('Тест вызова "getOrderByNumberThunk" с состоянием "fulfilled"', () => {
      const action = {
        type: getOrderByNumberThunk.fulfilled.type,
        payload: { orders: [{ id: 1, name: 'testItem' }, { id: 2, name: 'testItem2' }] }
      }
      const state = feedsReducer({...initialState}, action);
      expect(state.isOrderLoading).toBeFalsy();
      expect(state.order).toEqual(action.payload.orders[0]);
    })
  });
});
