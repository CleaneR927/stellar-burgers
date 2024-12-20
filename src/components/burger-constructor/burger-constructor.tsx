import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  burgerConstructorSelector,
  clearBurgerConstructor
} from '../../services/burgerConstructor/burgerConstructorSlice';
import {
  clearOrder,
  isOrderLoadingSelector,
  orderSelector
} from '../../services/order/orderSlice';
import { useNavigate } from 'react-router-dom';
import { orderBurgerThunk } from '../../services/order/orderAction';
import { isAuthCheckedSelector } from '../../services/userData/userDataSlice';

export const BurgerConstructor: FC = () => {
  const constructorItems = useSelector(burgerConstructorSelector);
  const orderRequest = useSelector(isOrderLoadingSelector);
  const orderModalData = useSelector(orderSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isAuthenticated = useSelector(isAuthCheckedSelector);
  const onOrderClick = () => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    const { bun, ingredients } = constructorItems;
    if (!constructorItems.bun || orderRequest) return;
    const orderData: string[] = [
      bun?._id!,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id!
    ];
    dispatch(orderBurgerThunk(orderData));
  };
  const buttonDisabled = useMemo(() => {
    const { bun, ingredients } = constructorItems;
    if (!bun || !ingredients.length) {
      return true;
    }
  }, [constructorItems]);
  const closeOrderModal = () => {
    navigate('/', { replace: true });
    dispatch(clearOrder());
    dispatch(clearBurgerConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
      disableButton={buttonDisabled || false}
    />
  );
};
