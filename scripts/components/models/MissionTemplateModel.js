let tableMeta = {
  cols: [
    {
      name: 'mission_source_id',
      caption: 'Источник',
      type: 'number',
      filter: {
        type: 'select',
        labelFunction: (id) => getMissionSourceById(id).name || id,
      }
    },
    // {
    // 	name: 'number',
    // 	caption: 'Номер',
    // 	type: 'number',
    // },
    // {
    // 	name: 'date_create',
    // 	caption: 'Дата выдачи',
    // 	type: 'date',
    // 	filter: {
    // 		type: 'select',
    // 	}
    // }
    {
      name: 'name',
      caption: 'Название',
      type: 'string',
      // filter: {
      // 	type: 'select'
      // }
    },
    {
      name: 'description',
      caption: 'Описание',
      type: 'string',
      // filter: {
      // 	type: 'select'
      // }
    },
    {
      name: 'passes_count',
      caption: 'Количество проходов',
      type: 'number',
      filter: {
        type: 'select'
      }
    },
    {
      name: 'technical_operation_id',
      caption: 'Технологическая операция',
      type: 'number',
      filter: {
        type: 'select',
        labelFunction: (id) => getTechOperationById(id).name || id,
      }
    },
  ]
};

import _ from 'lodash';

export const missionTemplateSchema = {
	properties: [
		{
			key: 'technical_operation_id',
      title: 'Технологическая операция',
			type: 'number',
			required: true,
		},
		{
			key: 'passes_count',
			title: 'Количество проходов',
			type: 'number',
			required: true,
      min: 0,
      max: 10,
		},
		{
			key: 'car_id',
			title: 'Транспортное средство',
			type: 'number',
			required: true,
		},
		{
			key: 'route_id',
			title: 'Маршрут',
			type: 'number',
			required: true,
		},
	],
};
//
// const closingProperties = [
//   {
//     key: 'fuel_given',
//     title: 'Топливо.Выдано',
//     type: 'floatFixed3',
//     required: false,
//   },
//   {
//     key: 'fuel_end',
//     title: 'Топливо.Возврат',
//     type: 'floatFixed3',
//     required: true,
//   },
//   {
//     key: 'odometr_end',
//     title: 'Одометр.Возврат',
//     type: 'floatFixed3',
//     required: false,
//   },
//   {
//     key: 'motohours_end',
//     title: 'Счетчик моточасов.Возврат',
//     type: 'floatFixed3',
//     required: false,
//   },
//   {
//     key: 'motohours_equip_end',
//     title: 'Счетчик моточасов обор-ния.Возврат',
//     type: 'floatFixed3',
//     required: false,
//   },
// ];

// export const missionTemplateClosingSchema = {
//   properties: closingProperties
// };
