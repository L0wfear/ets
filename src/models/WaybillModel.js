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
    // {
    //   key: 'responsible_person_id',
    //   title: 'Ответственное лицо',
    //   type: 'number',
    //   required: false,
    // },
    {
      key: 'car_id',
      title: 'Транспортное средство',
      type: 'number',
      required: true,
    },
    {
      key: 'trailer_id',
      title: 'Прицеп',
      type: 'number',
      required: false,
    },
    {
      key: 'fuel_start',
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
      required: true,
    },
    {
      key: 'equipment_fuel_start',
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
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
      type: 'number',
      float: 3,
      required: false,
    },
    {
      key: 'equipment_fuel_to_give',
      title: 'Топливо.Выдать',
      type: 'number',
      float: 3,
      required: false,
    },
    {
      key: 'odometr_start',
      title: 'Одометр.Выезд',
      type: 'number',
      float: 3,
      required: false,
    },
    {
      key: 'motohours_start',
      title: 'Счетчик моточасов.Выезд',
      type: 'number',
      float: 3,
      required: false,
    },
    {
      key: 'motohours_equip_start',
      title: 'Счетчик моточасов оборудования.Выезд',
      type: 'number',
      float: 3,
      required: false,
    },
    {
      key: 'distance',
      title: 'Пройдено по Глонасс, км',
      required: false,
      type: 'number',
      float: 3,
    },
    {
      key: 'downtime_hours_work',
      title: 'Работа',
      required: false,
      type: 'number',
      float: 1,
    },
    {
      key: 'downtime_hours_duty',
      title: 'Работа',
      required: false,
      type: 'number',
      float: 1,
    },
    {
      key: 'downtime_hours_dinner',
      title: 'Работа',
      required: false,
      type: 'number',
      float: 1,
    },
    {
      key: 'downtime_hours_repair',
      title: 'Работа',
      required: false,
      type: 'number',
      float: 1,
    },
  ],
  dependencies: {
    'odometr_start': [
      {
        validator: (value, formData) => {
          if (hasOdometer(formData.gov_number) && isEmpty(value)) {
            return 'Поле "Одометр.Выезд" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    'motohours_start': [
      {
        validator: (value, formData) => {
          if (!hasOdometer(formData.gov_number) && isEmpty(value)) {
            return 'Поле "Счетчик моточасов.Выезд" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    'plan_arrival_date': [
      {
        type: 'gt',
        field: 'plan_departure_date',
      },
    ],
    downtime_hours_work: [
      {
        validator: (value) => {
          if (value && value.match(/^\d{4,}/)) {
            return 'Поле "Работа" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_duty: [
      {
        validator: (value) => {
          if (value && value.match(/^\d{4,}/)) {
            return 'Поле "Дежурство" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_dinner: [
      {
        validator: (value) => {
          if (value && value.match(/^\d{4,}/)) {
            return 'Поле "Обед" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_repair: [
      {
        validator: (value) => {
          if (value && value.match(/^\d{4,}/)) {
            return 'Поле "Ремонт" должно быть меньше 1000';
          }
          return false;
        },
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
    type: 'number',
    float: 3,
    required: false,
  },
  {
    key: 'equipment_fuel_given',
    title: 'Топливо.Выдано',
    type: 'number',
    float: 3,
    required: false,
  },
  {
    key: 'fuel_end',
    title: 'Топливо.Возврат',
    type: 'number',
    float: 3,
    min: 0,
    required: true,
  },
  {
    key: 'equipment_fuel_end',
    title: 'Топливо.Возврат',
    type: 'number',
    float: 3,
    required: false,
  },
  {
    key: 'odometr_end',
    title: 'Одометр.Возврат',
    type: 'number',
    float: 3,
    required: 'odometr_start',
  },
  {
    key: 'motohours_end',
    title: 'Счетчик моточасов.Возврат',
    type: 'number',
    float: 3,
    required: 'motohours_start',
  },
  {
    key: 'motohours_equip_end',
    title: 'Счетчик моточасов оборудования.Возврат',
    type: 'number',
    float: 3,
    required: 'motohours_equip_start',
  },
  {
    key: 'consumption',
    title: 'Расход по ДУТ',
    type: 'number',
    float: 3,
    validation: false,
  },
  {
    key: 'comment',
    title: 'Комментарий',
    type: 'string',
    required: false,
    maxLength: 256,
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
        if (Math.abs((parseFloat(formData.odometr_diff || formData.motohours_diff || 0) - parseFloat(value || 0)) / 100) > 0.1) {
          return 'Расхождение в показателях пробега';
        }
        return false;
      },
    },
  ],
};

export const waybillClosingSchema = {
  properties: closingProperties,
  dependencies: closingDependencies,
};
