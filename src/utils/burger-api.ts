import { setCookie, getCookie } from './cookie';
import { TIngredient, TOrder, TOrdersData, TUser } from './types';

const URL = process.env.BURGER_API_URL;

//функция, которая проверяет успешность HTTP-ответа. Если ответ успешный, то возвращает данные в формате JSON. В противном случае, возвращает ошибку.
const checkResponse = <T>(res: Response): Promise<T> =>
  res.ok ? res.json() : res.json().then((err) => Promise.reject(err));

//общий тип для ответа сервера.
type TServerResponse<T> = {
  success: boolean;
} & T;

//тип для ответа на запрос обновления токена.
type TRefreshResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
}>;

/*отправляет POST-запрос для обновления токена доступа. При успешном получении нового токена, 
обновляет значения в localStorage и устанавливает куки с новым accessToken. */
export const refreshToken = (): Promise<TRefreshResponse> =>
  fetch(`${URL}/auth/token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  })
    .then((res) => checkResponse<TRefreshResponse>(res))
    .then((refreshData) => {
      if (!refreshData.success) {
        return Promise.reject(refreshData);
      }
      localStorage.setItem('refreshToken', refreshData.refreshToken);
      setCookie('accessToken', refreshData.accessToken);
      return refreshData;
    });

/*принимает URL и параметры запроса. Если запрос возвращает ошибку с сообщением о сроке действия токена (jwt expired), 
вызывает refreshToken, обновляет заголовки запроса и повторяет его.*/
export const fetchWithRefresh = async <T>(
  url: RequestInfo,
  options: RequestInit
) => {
  try {
    const res = await fetch(url, options);
    return await checkResponse<T>(res);
  } catch (err) {
    if ((err as { message: string }).message === 'jwt expired') {
      const refreshData = await refreshToken();
      if (options.headers) {
        (options.headers as { [key: string]: string }).authorization =
          refreshData.accessToken;
      }
      const res = await fetch(url, options);
      return await checkResponse<T>(res);
    } else {
      return Promise.reject(err);
    }
  }
};

type TIngredientsResponse = TServerResponse<{
  data: TIngredient[];
}>;

type TFeedsResponse = TServerResponse<{
  orders: TOrder[];
  total: number;
  totalToday: number;
}>;

type TOrdersResponse = TServerResponse<{
  data: TOrder[];
}>;

// выполняет GET-запрос для получения списка ингредиентов. Проверяет успешность ответа и возвращает данные.
export const getIngredientsApi = () =>
  fetch(`${URL}/ingredients`)
    .then((res) => checkResponse<TIngredientsResponse>(res))
    .then((data) => {
      if (data?.success) return data.data;
      return Promise.reject(data);
    });

// выполняет GET-запрос для получения всех заказов. Также проверяет успешность ответа и возвращает данные.
export const getFeedsApi = () =>
  fetch(`${URL}/orders/all`)
    .then((res) => checkResponse<TFeedsResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// использует fetchWithRefresh для выполнения GET-запроса к /orders. Возвращает массив заказов, если ответ успешен.
export const getOrdersApi = () =>
  fetchWithRefresh<TFeedsResponse>(`${URL}/orders`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit
  }).then((data) => {
    if (data?.success) return data.orders;
    return Promise.reject(data);
  });

// тип для ответа на запрос создания нового заказа. Содержит полное описание заказа (TOrder) и имя заказа.
type TNewOrderResponse = TServerResponse<{
  order: TOrder;
  name: string;
}>;

/* отправляет POST-запрос на создание нового заказа. Входные данные — массив идентификаторов ингредиентов. 
Запрос использует функцию fetchWithRefresh, чтобы обеспечить обновление токена, если он истек. Если запрос успешен, возвращает данные заказа, 
иначе — отклоняет промис с ошибкой.*/
export const orderBurgerApi = (data: string[]) =>
  fetchWithRefresh<TNewOrderResponse>(`${URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify({
      ingredients: data
    })
  }).then((data) => {
    if (data?.success) return data;
    return Promise.reject(data);
  });

// тип для получения списка заказов по номеру.
type TOrderResponse = TServerResponse<{
  orders: TOrder[];
}>;

// отправляет GET-запрос для получения информации о заказе по его номеру. Если ответ успешен, возвращает данные, в противном случае отклоняет промис.
export const getOrderByNumberApi = (number: number) =>
  fetch(`${URL}/orders/${number}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  }).then((res) => checkResponse<TOrderResponse>(res));

export type TRegisterData = {
  email: string;
  name: string;
  password: string;
};

// тип для ответов при регистрации и логине с токенами и данными пользователя.
type TAuthResponse = TServerResponse<{
  refreshToken: string;
  accessToken: string;
  user: TUser;
}>;

/* отправляет POST-запрос для регистрации нового пользователя с данными (email, имя и пароль). 
Проверяет ответ и возвращает данные пользователя вместе с токенами. В случае ошибки — отклоняет промис.*/
export const registerUserApi = (data: TRegisterData) =>
  fetch(`${URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

export type TLoginData = {
  email: string;
  password: string;
};

// отправляет POST-запрос для аутентификации пользователя. Работает аналогично функции registerUserApi, возвращая токены и информацию о пользователе.
export const loginUserApi = (data: TLoginData) =>
  fetch(`${URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TAuthResponse>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// отправляет POST-запрос на сброс пароля. Если запрос успешен, возвращает данные, иначе — отклоняет промис.
export const forgotPasswordApi = (data: { email: string }) =>
  fetch(`${URL}/password-reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// отправляет POST-запрос с новым паролем и токеном для завершения процедуры сброса пароля. Обработка аналогична предыдущим функциям.
export const resetPasswordApi = (data: { password: string; token: string }) =>
  fetch(`${URL}/password-reset/reset`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify(data)
  })
    .then((res) => checkResponse<TServerResponse<{}>>(res))
    .then((data) => {
      if (data?.success) return data;
      return Promise.reject(data);
    });

// тип для ответа с данными пользователя.
type TUserResponse = TServerResponse<{ user: TUser }>;

// выполняет GET-запрос для получения информации о текущем пользователе, используя функцию fetchWithRefresh для автоматического обновления токена.
export const getUserApi = () =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    headers: {
      authorization: getCookie('accessToken')
    } as HeadersInit
  });

// отправляет PATCH-запрос для обновления информации о пользователе. Использует токен авторизации и также обрабатывает случаи истечения срока действия токена.
export const updateUserApi = (user: Partial<TRegisterData>) =>
  fetchWithRefresh<TUserResponse>(`${URL}/auth/user`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
      authorization: getCookie('accessToken')
    } as HeadersInit,
    body: JSON.stringify(user)
  });

// отправляет POST-запрос на выход пользователя из системы, исключая refreshToken. Если запрос успешен, возвращает объект результата.
export const logoutApi = () =>
  fetch(`${URL}/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
    body: JSON.stringify({
      token: localStorage.getItem('refreshToken')
    })
  }).then((res) => checkResponse<TServerResponse<{}>>(res));
