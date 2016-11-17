import { isEmpty, hasOdometer } from 'utils/functions';

export const waybillSchema = {
  properties: [
    {
      key: 'plan_departure_date',
      title: 'Выезд план.',
      type: 'datetime',
      required: true,
    },
    {
      key: 'plan_arrival_date',
      title: 'Возвращение план.',
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
      key: 'responsible_person_id',
      title: 'Ответственное лицо',
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
      key: 'equipment_fuel_start',
      title: 'Топливо.Выезд',
      type: 'floatFixed3',
      required: false,
    },
    {
      key: 'fuel_type',
      title: 'Топливо.Тип',
      type: 'string',
      required: true,
    },
    {
      key: 'fuel_to_give',
      title: 'Топливо.Выдать',
      type: 'floatFixed3',
      required: false,
    },
    {
      key: 'equipment_fuel_to_give',
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
      title: 'Счетчик моточасов оборудования.Выезд',
      type: 'floatFixed3',
      required: false,
    },
    {
      key: 'distance',
      title: 'Пройдено, км',
      required: false,
      type: 'floatFixed3',
    }
  ],
  dependencies: {
    'odometr_start': [
      {
        validator: (value, formData) => {
          if (hasOdometer(formData.gov_number)) {
            if (isEmpty(value)) {
              return 'Поле "Одометр.Выезд" должно быть заполнено';
            }
          }
        },
      },
    ],
    'motohours_start': [
      {
        validator: (value, formData) => {
          if (!hasOdometer(formData.gov_number)) {
            if (isEmpty(value)) {
              return 'Поле "Счетчик моточасов.Выезд" должно быть заполнено';
            }
          }
        },
      },
    ],
    'plan_arrival_date': [
      {
        type: 'gt',
        field: 'plan_departure_date',
      },
    ],
  },
};

const closingProperties = [
  ...waybillSchema.properties,
  {
    key: 'fact_departure_date',
    title: 'Выезд факт.',
    type: 'datetime',
    required: true,
  },
  {
    key: 'fact_arrival_date',
    title: 'Возвращение факт.',
    type: 'datetime',
    required: true,
  },
  {
    key: 'fuel_given',
    title: 'Топливо.Выдано',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'equipment_fuel_given',
    title: 'Топливо.Выдано',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'fuel_end',
    title: 'Топливо.Возврат',
    type: 'floatFixed3',
    min: 0,
    required: true,
  },
  {
    key: 'equipment_fuel_end',
    title: 'Топливо.Возврат',
    type: 'floatFixed3',
    required: false,
  },
  {
    key: 'odometr_end',
    title: 'Одометр.Возврат',
    type: 'floatFixed3',
    required: true,
  },
  {
    key: 'motohours_end',
    title: 'Счетчик моточасов.Возврат',
    type: 'floatFixed3',
    required: true,
  },
  {
    key: 'motohours_equip_end',
    title: 'Счетчик моточасов оборудования.Возврат',
    type: 'floatFixed3',
    required: false,
  },
];

const closingDependencies = {
  ...waybillSchema.dependencies,
  'fact_arrival_date': [
    {
      type: 'gt',
      field: 'fact_departure_date',
    },
  ],
  'motohours_end': [
    {
      type: 'gte',
      field: 'motohours_start',
    },
  ],
  'motohours_equip_end': [
    {
      type: 'gte',
      field: 'motohours_equip_start',
    },
  ],
  'odometr_end': [
    {
      type: 'gte',
      field: 'odometr_start',
    },
  ],
  'distance': [
    {
      validator: (value, formData) => {
        // console.log(value, formData.odometr_diff);
        // console.log(Math.abs((parseFloat(formData.odometr_diff) - parseFloat(value)) / 100))
        if (Math.abs((parseFloat(formData.odometr_diff) - parseFloat(value)) / 100) > 0.1) {
          return 'Расхождение в показателях пробега';
        }
      },
    },
  ],
};

export const waybillClosingSchema = {
  properties: closingProperties,
  dependencies: closingDependencies,
};
