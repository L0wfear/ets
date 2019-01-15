import { isEmpty } from 'utils/functions';
import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import {
  ICreateFuel
} from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import {
  PropsFuelRate,
} from 'components/directories/normative/fuel_rates/FuelRateForm/@types/FuelRate.h';
export const fuelRateSchema: SchemaType<ICreateFuel, PropsFuelRate> = {
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
      integer: true,
      required: true,
    },
    {
      key: 'summer_rate',
      title: 'Норма для летнего периода',
      type: 'number',
      float: 3,
    },
    {
      key: 'winter_rate',
      title: 'Норма для зимнего периода',
      type: 'number',
      float: 3,
    },
    {
      key: 'car_special_model_id',
      title: 'Модель ТС',
      type: 'number',
      integer: true,
      required: true,
    },
    {
      key: 'car_model_id',
      title: 'Марка шасси',
      type: 'number',
      required: false,
      integer: true, // parse value to integer before sending to server
    },
  ],
  dependencies: {
    summer_rate: [
      (value, formState) => {
        if (isEmpty(formState.winter_rate) && isEmpty(value)) {
          return 'Одна из норм должна быть заполнена';
        }
        return undefined;
      },
    ],
    winter_rate: [
      (value, formState) => {
        if (isEmpty(formState.summer_rate) && isEmpty(value)) {
          return 'Одна из норм должна быть заполнена';
        }
        return undefined;
      },
    ],
    // Поле "Подразделение", скорее всего в новой ветке в dev
  },
};
