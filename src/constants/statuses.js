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
