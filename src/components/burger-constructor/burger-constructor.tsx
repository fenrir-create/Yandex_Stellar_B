import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { RootState } from 'src/services/store';

import { useSelector, useDispatch } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import {
  setRequestState,
  submitBurgerOrder,
  clearOrderData
} from '../../services/slices/constructorSlice/constructorSlice';

const selectBurgerBuilder = (state: RootState) => state.constructorBurger;
const selectAuthState = (state: RootState) => state.user;
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    selectedItems: { bun, fillings },
    orderDetails,
    requestInProgress
  } = useSelector(selectBurgerBuilder);

  const isAuth = useSelector(selectAuthState).isAuthenticated;

  const onOrderClick = () => {
    if (!isAuth) {
      navigate('/login');
      return;
    }

    if (!bun) return;

    // Создаем массив id ингредиентов для заказа
    const ingredients = [bun._id, ...fillings.map((item) => item._id), bun._id];

    dispatch(setRequestState(true));
    dispatch(submitBurgerOrder(ingredients));
  };

  const closeOrderModal = () => {
    dispatch(setRequestState(false));
    dispatch(clearOrderData());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      fillings.reduce(
        (sum: number, item: TConstructorIngredient) => sum + item.price,
        0
      ),
    [bun, fillings]
  );
  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={requestInProgress}
      constructorItems={{ bun, ingredients: fillings }}
      orderModalData={orderDetails}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
