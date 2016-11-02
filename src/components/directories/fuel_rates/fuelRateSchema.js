import { isEmpty } from 'utils/functions';

export const fuelRateSchema = {
  properties: [
    {
      key: 'order_date',
      title: 'Дата приказа',
      type: 'date',
      required: true,
    },
    {
      key: 'operation_id',
      title: 'Операция',
      type: 'number',
      required: true,
    },
    {
      key: 'summer_rate',
      title: 'Норма для летнего периода',
      type: 'number',
    },
    {
      key: 'winter_rate',
      title: 'Норма для зимнего периода',
      type: 'number',
    },
    {
      key: 'car_special_model_id',
      title: 'Модель ТС',
      type: 'number',
      required: true,
    },
    {
      key: 'car_model_id',
      title: 'Марка шасси',
      type: 'number',
      required: false,
    },
  ],
  dependencies: {
    'summer_rate': [
      {
        validator: (value, formData) => {
          if (isEmpty(formData.winter_rate) && isEmpty(value)) {
            return 'Одна из норм должна быть заполнена';
          }
          return undefined;
        },
      },
    ],
    'winter_rate': [
      {
        validator: (value, formData) => {
          if (isEmpty(formData.summer_rate) && isEmpty(value)) {
            return 'Одна из норм должна быть заполнена';
          }
          return undefined;
        },
      },
    ],
  },
};

export const defaultElement = {
  order_date: new Date(),
  operation_id: null,
  car_model_id: null,
  car_special_model_id: null,
};
