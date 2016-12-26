const list = [
  {
    id: 1,
    title: 'В движении',
    color: '#2ECC40',
  },
  {
    id: 2,
    title: 'Остановка',
    color: '#563d7c',
  },
  {
    id: 3,
    title: 'Стоянка',
    color: '#f34b7d',
  },
  {
    id: 4,
    title: 'Не на связи',
    color: '#888888',
  },
];

const index = {};

list.forEach(item => (index[item.id] = item));

export default list;
export function getStatusById(id) {
  return index[id];
}

export const WAYBILL_STATUSES = {
  draft: 'Черновик',
  active: 'Активен',
  closed: 'Закрыт',
  // default: 'Н/Д',
};

export const PERIODIC_REPORT_STATUSES = {
  full_traveled: 'Пройдено полностью',
  not_traveled: 'Не пройдено',
  traveled_less_than_half: 'Пройдено меньше половины',
  traveled_more_than_half: 'Пройдено больше половины',
  default: 'Н/Д',
};

export const REPORT_STATUSES = {
  fail: 'Ошибка',
  success: 'Обработан',
  'in progress': 'В обработке',
  wait: 'В очереди',
  default: 'Н/Д',
};
