import burgerConstructorReducer, { addIngredient, clearBurgerConstructor, downIngredient, removeIngredient, upIngredient } from '../src/services/burgerConstructor/burgerConstructorSlice';

const ingredientsMockData = [
    {
      "_id": "643d69a5c3f7b9001cfa093c",
      "name": "Краторная булка N-200i",
      "type": "bun",
      "proteins": 80,
      "fat": 24,
      "carbohydrates": 53,
      "calories": 420,
      "price": 1255,
      "image": "https://code.s3.yandex.net/react/code/bun-02.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/bun-02-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/bun-02-large.png",
      "__v": 0
    },
    {
      "_id": "643d69a5c3f7b9001cfa093e",
      "name": "Филе Люминесцентного тетраодонтимформа",
      "type": "main",
      "proteins": 44,
      "fat": 26,
      "carbohydrates": 85,
      "calories": 643,
      "price": 988,
      "image": "https://code.s3.yandex.net/react/code/meat-03.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/meat-03-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/meat-03-large.png",
      "__v": 0
    },
    {
      "_id": "643d69a5c3f7b9001cfa0942",
      "name": "Соус Spicy-X",
      "type": "sauce",
      "proteins": 30,
      "fat": 20,
      "carbohydrates": 40,
      "calories": 30,
      "price": 90,
      "image": "https://code.s3.yandex.net/react/code/sauce-02.png",
      "image_mobile": "https://code.s3.yandex.net/react/code/sauce-02-mobile.png",
      "image_large": "https://code.s3.yandex.net/react/code/sauce-02-large.png",
      "__v": 0
    }
  ]

  describe('Проверка работы "burgerConstructorReducer"', () => {
    const initialState = {
      burgerConstructor: {
        bun: null,
        ingredients: []
      },
      error: null
    };

    describe('Работа с ингредиентами', () => {
      test('Добавление булки в конструктор методом "addIngredient"', () => {
        const state = burgerConstructorReducer(initialState, addIngredient(ingredientsMockData[0]));
        const updateState = {...state.burgerConstructor.bun };
        delete updateState.id;
        expect(updateState).toEqual(ingredientsMockData[0]);
        expect(state.burgerConstructor.ingredients).toHaveLength(0);
      });

      test('Добавление основного ингредиента в конструктор методом "addIngredient"', () => {
        const state = burgerConstructorReducer(initialState, addIngredient(ingredientsMockData[1]));
        const updateState = {...state.burgerConstructor.ingredients[0]};
        delete updateState.id;
        expect(updateState).toEqual(ingredientsMockData[1]);
        expect(state.burgerConstructor.bun).toBeNull();
      });

      test('Удаление основного ингредиента из конструктор методом "removeIngredient"', () => {
        const changeState = { 
          ...initialState, 
          burgerConstructor: { 
            bun: null, 
            ingredients: [
              {...ingredientsMockData[1], id : '123'}, 
              {...ingredientsMockData[2], id : '456'}
            ] 
          } 
        };
        const state = burgerConstructorReducer(changeState, removeIngredient(changeState.burgerConstructor.ingredients[0]));
        expect(state.burgerConstructor.ingredients).toHaveLength(1); // Удаляем филе из массива ингредиентов и проверяем, что остался только соус
        const updateState = {...state.burgerConstructor.ingredients[0]};
        delete updateState.id;
        expect(updateState).toEqual(ingredientsMockData[2]); // Проверяем, что остался только такой же соус, как во входных данных
      });

      describe('Перемещение ингредиентов в конструкторе', () => {
        const changeState = { 
          ...initialState, 
          burgerConstructor: { 
            bun: null, 
            ingredients: [
              ingredientsMockData[1], 
              ingredientsMockData[2]
            ] 
          } 
        };

        test('Поднять ингредиент методом "upIngredient"', () => {
          const state = burgerConstructorReducer(changeState, upIngredient(1));
          expect(state.burgerConstructor.ingredients).toHaveLength(2);
          expect(state.burgerConstructor.ingredients[1]).toEqual(ingredientsMockData[1]);
          expect(state.burgerConstructor.ingredients[0]).toEqual(ingredientsMockData[2]);
        });
  
        test('Опустить ингредиент методом "downIngredient"', () => {
          const state = burgerConstructorReducer(changeState, downIngredient(0));
          expect(state.burgerConstructor.ingredients).toHaveLength(2);
          expect(state.burgerConstructor.ingredients[1]).toEqual(ingredientsMockData[1]);
          expect(state.burgerConstructor.ingredients[0]).toEqual(ingredientsMockData[2]);
        });
      });
    });

    test('Очистка конструктора после оформления заказа методом "clearBurgerConstructor', () => {
      const changeState = {
        ...initialState,
        burgerConstructor: {
          bun: ingredientsMockData[0],
          ingredients: [
            ingredientsMockData[1],
            ingredientsMockData[2]
          ]
        }
      }
      const state = burgerConstructorReducer(changeState, clearBurgerConstructor());
          expect(state.burgerConstructor.bun).toBeNull();
          expect(state.burgerConstructor.ingredients).toHaveLength(0);
    });
  });
