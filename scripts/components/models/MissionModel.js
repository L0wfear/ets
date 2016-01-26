import _ from 'lodash';

export const missionSchema = {
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
		},
		{
			key: 'car_id',
			title: 'Транспортное средство',
			type: 'number',
			required: false,
		},
		{
			key: 'route_id',
			title: 'Маршрут',
			type: 'number',
			required: true,
		},
    {
      key: 'mission_source_id',
      title: 'Источник получения задания',
      type: 'number',
      required: true,
    }
	],
};

const closingProperties = [
  {
    key: 'fuel_given',
    title: 'Топливо.Выдано',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'fuel_end',
    title: 'Топливо.Возврат',
    type: 'floatFixed3',
    required: true,
  },
  {
    key: 'odometr_end',
    title: 'Одометр.Возврат',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'motohours_end',
    title: 'Счетчик моточасов.Возврат',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'motohours_equip_end',
    title: 'Счетчик моточасов обор-ния.Возврат',
    type: 'floatFixed3',
    required: false,
  },
];

export const missionClosingSchema = {
  properties: closingProperties
};
