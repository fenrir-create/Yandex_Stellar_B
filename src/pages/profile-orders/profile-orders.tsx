import { useSelector, useDispatch } from '../../services/store';
import {
  selectAuthState,
  fetchOrders
} from '../../services/slices/userSlice/userSlice';
import {
  selectFeedState,
  fetchFeeds
} from '../../services/slices/feedSlice/feedSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { Preloader } from '@ui';
import { useEffect, FC } from 'react';
import type { RootState } from '../../services/store';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();

  // Получаем данные из store через селекторы
  const orders = useSelector((state: RootState) => state.user.orders);
  const isOrdersLoading = useSelector(
    (state: RootState) => state.user.isLoading
  );

  // Аналогично для фида, если нужно
  const feedItems = useSelector((state: RootState) => state.feed.items);
  const isFeedLoading = useSelector((state: RootState) => state.feed.isLoading);

  useEffect(() => {
    dispatch(fetchOrders());
    dispatch(fetchFeeds());
  }, [dispatch]);

  if (isOrdersLoading || isFeedLoading) {
    return <Preloader />;
  }

  return <ProfileOrdersUI orders={orders} />;
};
