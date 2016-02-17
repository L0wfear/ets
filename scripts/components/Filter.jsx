// import React from 'react';
// import { setFilter } from '../store.js';
//
// let STATUSES = [
//   {
//     id: 'moving',
//     title: 'Уборка',
//     icon: 'images/car-green.png'
//   },
//   {
//     id: 'parking',
//     title: 'Простой (более 5 минут)',
//     icon: 'images/car-red.png'
//   },
//   {
//     id: 'stop',
//     title: 'Стоянка (на базе)',
//     icon: 'images/car-gray.png'
//   }
// ];
//
// export default React.createClass({
//
//   render() {
//     let buttons = STATUSES.map(s => {
//       let className = 'filter-item ';
//
//       if (this.props.filter[s.id]) {
//         className += 'filter-item--selected';
//       }
//
//       return (
//         <button key={s.id} className={className} onClick={() => this.toggleFilter(s.id)}>
//           <img src={s.icon}/>{s.title}
//         </button>
//         );
//     });
//
//     return (
//       <div className="map-filter">
//         {buttons}
//       </div>
//       );
//   },
//
//   toggleFilter(name) {
//     let newFilter = Object.assign({}, this.props.filter, {
//       [name]: !this.props.filter[name]
//     });
//
//     setFilter(newFilter);
//   }
//
// });
