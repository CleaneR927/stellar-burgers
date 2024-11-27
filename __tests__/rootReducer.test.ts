import store, { rootReducer } from '../src/services/store';

describe('Проверка инициализации "rootReducer"', () => {
  test('Проверка инициализации корневого редьюсера при вызове с "undefined" и типом "unknown"', () => {
    const initialState = store.getState();
    /* undefined указывает на то, что редьюсер вызывается впервые и не имеет предшествующего состояния. 
    unknown возвращать текущее состояние, поскольку это действие не соответствует никакому известному варианту обработки.*/
    const state = rootReducer(undefined, { type: 'unknown' });
    expect(state).toEqual(initialState);
  })
});
