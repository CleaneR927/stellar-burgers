import * as userData from '../fixtures/user.json';
import * as orders from '../fixtures/orders.json';

const baseUrl = Cypress.config('baseUrl');
const apiUrl = Cypress.env('BURGER_API_URL');
const checkModalIsOpen = (data: string) => {
  cy.get(`[data-test="${data}"]`).click();
  cy.wait(500);
  cy.get('#modals').find('[data-test="modal-content"]').should('have.length', 1);
};

const closeModalOnClick = () => {
  cy.get('#modals').find('button').click();
  cy.wait(500);
  cy.get('#modals').find('[data-test="modal-content"]').should('have.length', 0);
}
interface ILocalStorage {
  [key: string]: string | null;
}
const localStorage = {
  storage: {} as ILocalStorage,
  
  getItem: (key: string) => {
    return localStorage.storage[key] || null;
  },
  setItem: (key: string, value: string) => {
    localStorage.storage[key] = value;
  },
  removeItem: (key: string) => {
    delete localStorage.storage[key];
  },
};

describe('Интеграционный (E2E) тест страницы конструктора бургера', () => {
  // Перед каждым тестом перехватываем запрос и заменяем моками (заглушками) на получение ингредиентов и переходим на страницу конструктора
  beforeEach(() => {
    cy.intercept('GET', `${apiUrl}/ingredients`, {fixture: 'ingredients'}).as('getIngredients');
    cy.visit('/');
    cy.wait('@getIngredients');
    cy.viewport(1920, 1080); 
  });
  it('Проверка наличия булок и ингредиентов', () => {
    // Проверяем наличие булки
    cy.get('[data-test="bun"]').should('have.length.at.least', 1).first().contains('Краторная булка N-200i');
    // Проверяем наличие основного ингредиента
    cy.get('[data-test="main"]').should('have.length.at.least', 1).first().contains('Филе Люминесцентного тетраодонтимформа');
    // Проверяем наличие соуса
    cy.get('[data-test="sauce"]').should('have.length.at.least', 1).first().contains('Соус Spicy-X');
  })

  it('Проверка добавления ингредиентов в конструктор', () => {
    cy.get('[data-test="bun"]').find('button').contains('Добавить').click();
    cy.get('[data-test="main"]').find('button').contains('Добавить').click();
    cy.get('[data-test="sauce"]').find('button').contains('Добавить').click();
    cy.get('[data-test="constructor-element"]').contains('верх').should('have.length', 1);
    cy.get('[data-test="constructor-element"]').contains('низ').should('have.length', 1);
    cy.get('[data-test="constructor-elements"]').contains('Филе Люминесцентного тетраодонтимформа').should('have.length.at.least', 1);
    cy.get('[data-test="constructor-elements"]').contains('Соус Spicy-X').should('have.length.at.least', 1);
    cy.get('[data-test="sauce"]').find('button').contains('Добавить').click();
    cy.get('[data-test="constructor-elements"]').find('li').eq(4).contains('Соус Spicy-X');
  })

  describe('Проверка работоспособности модального окна', () => {
    describe('Открытие модального окна', () => {
      it('По клику на карточку ингредиента', () => {
        checkModalIsOpen('bun');
      })
      it('Проверка открытости окна после перезагрузки страницы', () => {
        checkModalIsOpen('main')
        cy.reload();
        cy.intercept('GET', `${apiUrl}/ingredients`, {fixture: 'ingredients'}).as('getIngredients');
        cy.wait('@getIngredients');
        cy.get('#modals').find('[data-test="modal-content"]').should('have.length', 1);
      })
    })
    describe('Закрытие модального окна', () => {
      it('Закрытие по клику на крестик', () => {
        checkModalIsOpen('sauce');
        closeModalOnClick();
      })
      it('Закрытие по клику на оверлей', () => {
        checkModalIsOpen('sauce');
        cy.get('[data-test="orverlay-modal"]').click({ force: true }); // принудительный клик на перекрытом элемента (в данном случае оверлей за модалкой)
        cy.wait(500);
        cy.get('#modals').find('[data-test="modal-content"]').should('have.length', 0);
      })
      it('Закрытие по кнопке ESC', () => {
        checkModalIsOpen('sauce');
        cy.get('body').type('{esc}');
        cy.wait(500);
        cy.get('#modals').find('[data-test="modal-content"]').should('have.length', 0);
      })
    })
  })
  describe('Проверка оформления заказа', () => {
    beforeEach(() => {
      // Установка моковых токенов
      cy.setCookie('accessToken', 'EXAMPLE_ACCESS_TOKEN');
      localStorage.setItem('refreshToken', 'EXAMPLE_REFRESH_TOKEN');
      cy.wait(500);
      cy.intercept('GET', `${apiUrl}/auth/user`, {fixture: 'user'}).as('getUser');
      cy.intercept('POST', `${apiUrl}/orders`, {fixture: 'orders'}).as('postOrders');
      cy.visit('/');
      cy.wait('@getUser');
    });
    describe('Проверка наличия моковых токенов в куки и локальном хранилище, авторизации пользователя', () => {
      it('Проверка наличия refreshToken в localStorage', () => {
        expect(localStorage.getItem('refreshToken')).to.equal('EXAMPLE_REFRESH_TOKEN');
      });
      it('Проверка наличия accessToken в куках', () => {
        cy.getCookie('accessToken').should('exist'); // Проверка существования токена
        cy.getCookie('accessToken').should('have.property', 'value', 'EXAMPLE_ACCESS_TOKEN'); // Проверка наличия конкретного токена
      });
      it('Проверка авторизации пользователя', () => {
        cy.get('[data-test="profile-autorization"]').contains(`${userData.user.name}`);
      });
    })

    it('Добавление ингредиентов и создание заказа', () => {
      // Добавление ингредиентов и нажатие кнопки "Оформить заказ"
      cy.get('[data-test="bun"]').find('button').contains('Добавить').click();
      cy.get('[data-test="constructor-element"]').contains('верх').should('have.length', 1);
      cy.get('[data-test="constructor-element"]').contains('низ').should('have.length', 1);
      cy.get('[data-test="order-button"]').should('be.disabled');
      cy.get('[data-test="main"]').find('button').contains('Добавить').click();
      cy.get('[data-test="order-button"]').should('not.be.disabled');
      cy.get('[data-test="sauce"]').find('button').contains('Добавить').click();
      cy.get('[data-test="order-button"]').should('not.be.disabled').click();
      cy.wait('@postOrders');
      // Проверка корректонсти номера созданного заказа с моковыми данными
      cy.get('#modals h2:first-of-type').should('have.text', orders.order.number);
      closeModalOnClick();
      // Проверка очистки конструктора после оформления заказа
      cy.get('[data-test="constructor-array"]').contains('Выберите булки');
      cy.get('[data-test="constructor-array"]').contains('Выберите начинку');
      cy.get('[data-test="order-button"]').should('be.disabled');
    })

    afterEach(() => {
      // Удаление моковых токенов
      cy.clearCookie('accessToken');
      localStorage.removeItem('refreshToken');
      cy.wait(500);
      // Проверка удаления токенов
      cy.getCookie('accessToken').should('not.exist');
      expect(localStorage.getItem('refreshToken')).to.be.null;
    });
  });
})
