import _ from 'lodash';

export const missionSchema = {
	properties: [
		{
			key: 'plan_departure_date',
			type: 'datetime',
			required: true,
		},
		{
			key: 'plan_arrival_date',
			type: 'datetime',
			required: true,
		},
		{
			key: 'driver_id',
			title: 'Водитель',
			type: 'number',
			required: true,
		},
		{
			key: 'car_id',
			title: 'Транспортное средство',
			type: 'number',
			required: true,
		},
		{
			key: 'fuel_start',
			title: 'Топливо.Выезд',
			type: 'floatFixed3',
			required: true,
		},
		{
			key: 'fuel_type_id',
			title: 'Топливо.Тип',
			type: 'number',
			required: true,
		},
		{
			key: 'fuel_to_give',
			title: 'Топливо.Выдать',
			type: 'floatFixed3',
			required: false,
		},
		{
			key: 'odometr_start',
			title: 'Одометр.Выезд',
			type: 'floatFixed3',
			required: false,
		},
		{
			key: 'motohours_start',
			title: 'Счетчик моточасов.Выезд',
			type: 'floatFixed3',
			required: false,
		},
		{
			key: 'motohours_equip_start',
			title: 'Счетчик моточасов обор-ния.Выезд',
			type: 'floatFixed3',
			required: false,
		},
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
};;
