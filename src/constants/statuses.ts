export const list = [
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

export const listObj = list.reduce((newObj, { id, ...other }) => ({
  ...newObj,
  [id]: {
    id,
    ...other,
  },
}), {});

const index = {};

list.forEach((item) => (index[item.id] = item));

export default list;
export function getStatusById(id) {
  return index[id];
}

export const WAYBILL_STATUSES_KEY = {
  draft: 'draft',
  active: 'active',
  closed: 'closed',
  deleted: 'deleted',
};

export const WAYBILL_STATUSES = {
  [WAYBILL_STATUSES_KEY.draft]: 'Черновик',
  [WAYBILL_STATUSES_KEY.active]: 'Активен',
  [WAYBILL_STATUSES_KEY.closed]: 'Закрыт',
  [WAYBILL_STATUSES_KEY.deleted]: 'Удален',
};

export const LOAD_PROCESS_TEXT = 'Загрузка...';
export const NO_DATA_TEXT = 'Нет данных';
export const NO_SENSORS_LEVEL_TEXT = 'Нет датчиков уровня топлива';
export const NO_SENSORS_EQUIPMENT_TEXT = 'Нет датчиков навесного оборудования';
