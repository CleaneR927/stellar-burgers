import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { userOrdersSelector } from '../../services/userData/userDataSlice';
import { getOrdersThunk } from '../../services/userData/userDataAction';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(userOrdersSelector);
  useEffect(() => {
    dispatch(getOrdersThunk());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
