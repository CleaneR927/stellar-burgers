import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { getFeedsThunk } from '../../services/feeds/feedsAction';
import { ordersSelector } from '../../services/feeds/feedsSlice';
import { useDispatch, useSelector } from '../../services/store';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(ordersSelector); // извлекаем список заказов в переменную

  useEffect(() => {
    dispatch(getFeedsThunk()); // получаем данные о заказах перед при монтировании компонента один раз
  }, []);

  if (!orders.length) {
    return <Preloader />; // индикатор загрузки, если данных нет
  }

  return (
    <FeedUI
      orders={orders}
      handleGetFeeds={() => {
        dispatch(getFeedsThunk()); // повторно получаем данные о заказах
      }}
    />
  );
};
