import { FC } from 'react';
import { useSelector } from '../../services/store';
import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';

const extractNumbers = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((ord) => ord.status === status)
    .map((ord) => ord.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const feedData = useSelector((state) => state.feed);
  const { items: allOrders, totalCount, todayCount } = feedData;

  // Статистика для UI
  const stats = { total: totalCount, today: todayCount };

  // Выбираем номера выполненных и в работе
  const completedOrders = extractNumbers(allOrders, 'done');
  const inProgressOrders = extractNumbers(allOrders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={completedOrders}
      pendingOrders={inProgressOrders}
      feed={stats}
    />
  );
};
