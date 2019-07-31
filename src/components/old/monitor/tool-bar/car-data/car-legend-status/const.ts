import { ListStatusType } from 'components/monitor/tool-bar/car-data/car-legend-status/CarLegendStatus.h';
/**
 * статусы тс из сокета
 */
export const listStatus: ListStatusType = [
  {
    key: 'in_move',
    status: 1,
    title: 'В движении:',
    storeName: 'in_move',
  },
  {
    key: 'stop',
    status: 2,
    title: 'Остановка:',
    storeName: 'stop',
  },
  {
    key: 'parking',
    status: 3,
    title: 'Стоянка:',
    storeName: 'parking',
  },
  {
    key: 'not_in_touch',
    status: 4,
    title: 'Не на связи:',
    storeName: 'not_in_touch',
  },
];
