// const list = [
//   {
//     id: 1,
//     title: 'Едет в соответствии с режимом по скорости',
//     color: '#2ECC40'
//   },
//   {
//     id: 2,
//     title: 'Едет не по режиму по скорости',
//     color: '#7FDBFF'
//   },
//   {
//     id: 3,
//     title: 'Остановка',
//     color: '#FFDC00'
//   },
//   {
//     id: 4,
//     title: 'Стоянка',
//     color: '#FF4136'
//   },
//   {
//     id: 5,
//     title: 'Вне ОДХ',
//     color: '#111111'
//   },
//   {
//     id: 6,
//     title: 'Потеряна связь',
//     color: '#AAAAAA'
//   }
// ];

const list = [
  {
    id: 1,
    title: 'В движении',
    color: '#2ECC40'
  },
  {
    id: 2,
    title: 'Остановка',
    color: '#563d7c'
  },
  {
    id: 3,
    title: 'Стоянка',
    color: '#f34b7d'
  },
  {
     id: 4,
     title: 'Не на связи',
     color: '#AAAAAA'
  }
];

const index = {};

list.forEach(item => index[item.id] = item);

export default list;
export function getStatusById(id) {
  return index[id];
}
