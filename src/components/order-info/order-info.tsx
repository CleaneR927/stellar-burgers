import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { getOrderByNumberThunk } from '../../services/feeds/feedsAction';
import { orderSelector } from '../../services/feeds/feedsSlice';
import { ingredientsSelector } from '../../services/ingredients/ingredientsSlice';

export const OrderInfo: FC<{ title?: string }> = ({ title }) => {
  const dispatch = useDispatch();
  const { number } = useParams();

  useEffect(() => {
    dispatch(getOrderByNumberThunk(Number(number))); //Асинхронный запрос к серверу за получением данных заказа по id при монтировании компонента
  }, []);

  const orderData = useSelector(orderSelector);
  const ingredients = useSelector(ingredientsSelector);
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  useEffect(() => {
    if (orderInfo && ingredients.length) {
      document.title = `Заказ ${orderInfo.number} - ${Object.values(
        orderInfo.ingredientsInfo
      )
        .map((ing) => ing.name)
        .join(', ')}`;
    }
  }, [orderInfo, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} title={title} />;
};
