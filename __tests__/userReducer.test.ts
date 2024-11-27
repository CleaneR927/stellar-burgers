import { getOrdersThunk, getUserThunk, loginUserThunk, logoutUserThunk, registerUserThunk, updateUserThunk } from '../src/services/userData/userDataAction';
import userReducer, { clearErrors } from '../src/services/userData/userDataSlice';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn(),
  getUserApi: jest.fn(),
  loginUserApi: jest.fn(),
  logoutApi: jest.fn(),
  registerUserApi: jest.fn(),
  updateUserApi: jest.fn()
}));

describe('Проверка работы "userReducer"', () => {
  beforeEach(() => {
    jest.clearAllMocks(); // Очищаем моки перед каждым тестом
  });

  const registerMockData = {
    email: 'test@test.ru',
    name: 'TestUser',
    password: 'testPassword'
  };

  const loginMockData = {
    email: 'test@test.ru',
    password: 'testPassword'
  };

  const userMockData = {
    email: 'test@test.ru',
    name: 'TestUser'
  };

  const ordersMockData = [
      {
        id: 1,
        ingredients: ['1', '2', '3'],
        status: 'done',
        name: 'TestOrder',
        createdAt: '2022-01-01T00:00:00.000Z',
        updatedAt: '2022-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        ingredients: ['4', '5', '6'],
        status: 'done',
        name: 'TestOrder2',
        createdAt: '2022-01-01T00:00:00.000Z',
        updatedAt: '2022-01-01T00:00:00.000Z',
      }
  ];

  const initialState = {
    isAuthenticated: false,
    loginUserRequest: false,
    user: null,
    orders: [],
    ordersRequest: false,
    error: null
  };

  describe('Проверка работы "userSlice"', () => {
    describe('Тест вызова "loginUserThunk"', () => {
      test('Тест вызова "loginUserThunk" с состоянием "pending"', () => {
        const action = { type: loginUserThunk.pending.type };
        const state = userReducer(initialState, action);
        expect(state.loginUserRequest).toBeTruthy();
        expect(state.error).toBeNull();
      });

      test('Тест вызова "loginUserThunk" с состоянием "rejected"', () => {
        const action = { 
          type: loginUserThunk.rejected.type,
          error: { message: 'error login user' }
        };
        const state = userReducer(initialState, action);
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.error).toBe(action.error.message);
      });

      test('Тест вызова "loginUserThunk" с состоянием "fulfilled"', () => {
        const action = {
          type: loginUserThunk.fulfilled.type,
          payload: { user: loginMockData }
        }
        const state = userReducer(initialState, action);
        expect(state.isAuthenticated).toBeTruthy();
        expect(state.user).toEqual(action.payload);
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.isAuthenticated).toBeTruthy();
      });
    });

    describe('Тест вызова "registerUserThunk"', () => {
      test('Тест вызова "registerUserThunk" с состоянием "pending"', () => {
        const action = { type: registerUserThunk.pending.type };
        const state = userReducer(initialState, action);
        expect(state.isAuthenticated).toBeFalsy();
        expect(state.loginUserRequest).toBeTruthy();
      });

      test('Тест вызова "registerUserThunk" с состоянием "rejected"', () => {
        const action = {
          type: registerUserThunk.rejected.type,
          error: { message: 'error register user' }
        }
        const state = userReducer(initialState, action);
        expect(state.isAuthenticated).toBeFalsy();
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.error).toBe(action.error.message);
      });

      test('Тест вызова "registerUserThunk" с состоянием "fulfilled"', () => {
        const action = {
          type: registerUserThunk.fulfilled.type,
          payload: { user: registerMockData }
        }
        const state = userReducer(initialState, action);
        expect(state.isAuthenticated).toBeTruthy();
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.user).toEqual(action.payload);
      });
    });

    test('Тест вызова "logoutUserThunk" с состоянием "pending"', () => {
      const action = { type: logoutUserThunk.pending.type };
      const state = userReducer(initialState, action);
      expect(state.user).toBeNull();
      expect(state.loginUserRequest).toBeFalsy();
      expect(state.isAuthenticated).toBeFalsy();
    });

    describe('Тест вызова "getUserThunk"', () => {
      test('Тест вызова "getUserThunk" с состоянием "pending"', () => {
        const action = { type: getUserThunk.pending.type };
        const state = userReducer(initialState, action);
        expect(state.loginUserRequest).toBeTruthy();
      });

      test('Тест вызова "getUserThunk" с состоянием "rejected"', () => {
        const action = {
          type: getUserThunk.rejected.type,
          error: { message: 'error getting user' }
        }
        const state = userReducer(initialState, action);
        expect(state.user).toBeNull();
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.error).toBe(action.error.message);
      });

      test('Тест вызова "getUserThunk" с состоянием "fulfilled"', () => {
        const action = {
          type: getUserThunk.fulfilled.type,
          payload: { user: userMockData }
        }
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(action.payload.user);
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.isAuthenticated).toBeTruthy();
      });
    });

    describe('Тест вызова "updateUserThunk"', () => {
      test('Тест вызова "updateUserThunk" с состоянием "pending"', () => {
        const action = { type: updateUserThunk.pending.type };
        const state = userReducer(initialState, action);
        expect(state.loginUserRequest).toBeTruthy();
      });

      test('Тест вызова "updateUserThunk" с состоянием "rejected"', () => {
        const action = {
          type: updateUserThunk.rejected.type,
          error: { message: 'error updating user' }
        }
        const state = userReducer(initialState, action);
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.error).toBe(action.error.message);
      });

      test('Тест вызова "updateUserThunk" с состоянием "fulfilled"', () => {
        const action = {
          type: updateUserThunk.fulfilled.type,
          payload: { user: userMockData }
        }
        const state = userReducer(initialState, action);
        expect(state.user).toEqual(action.payload.user);
        expect(state.loginUserRequest).toBeFalsy();
        expect(state.isAuthenticated).toBeTruthy();
      });
    });

    describe('Тест вызова "getOrdersThunk"', () => {
      test('Тест вызова "getOrdersThunk" с состоянием "pending"', () => {
        const action = { type: getOrdersThunk.pending.type };
        const state = userReducer(initialState, action);
        expect(state.ordersRequest).toBeTruthy();
      });

      test('Тест вызова "getOrdersThunk" с состоянием "rejected"', () => {
        const action = {
          type: getOrdersThunk.rejected.type,
          error: { message: 'error getting orders' }
        }
        const state = userReducer(initialState, action);
        expect(state.ordersRequest).toBeFalsy();
        expect(state.error).toBe(action.error.message);
      });

      test('Тест вызова "getOrdersThunk" с состоянием "fulfilled"', () => {
        const action = {
          type: getOrdersThunk.fulfilled.type,
          payload: { orders: ordersMockData }
        }
        const state = userReducer(initialState, action);
        expect(state.orders).toEqual(action.payload);
        expect(state.ordersRequest).toBeFalsy();
      });
    });
  });

  test('Тестирование редьюсера "clearErrors"', () => {
    const expectedResult = {
      ...initialState,
      error: 'Пользователь не существует'
    }
    const state = userReducer(expectedResult, clearErrors());
    expect(state).toEqual(initialState);
  });
});
