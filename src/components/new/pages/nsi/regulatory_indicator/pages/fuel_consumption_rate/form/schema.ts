import { isEmpty } from 'utils/functions';
import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { FuelRate } from 'redux-main/reducers/modules/fuel_rates/@types/fuelRates.h';
import { PropsFuelRate } from 'components/new/pages/nsi/regulatory_indicator/pages/fuel_consumption_rate/form/@types/FuelConsumptionRateFrom';

export const fuelRateSchema: SchemaType<FuelRate, PropsFuelRate> = {
  properties: {
    order_date: {
      title: 'Дата приказа',
      type: 'date',
      required: true,
    },
    order_number: {
      title: 'Номер приказа',
      type: 'string',
      required: true,
    },
    operation_id: {
      title: 'Операция',
      type: 'valueOfArray',
      required: true,
    },
    summer_rate: {
      title: 'Норма для летнего периода',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, formState) => {
          if (isEmpty(formState.winter_rate) && isEmpty(value)) {
            return 'Одна из норм должна быть заполнена';
          }
          return '';
        },
      ],
    },
    winter_rate: {
      title: 'Норма для зимнего периода',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, formState) => {
          if (isEmpty(formState.summer_rate) && isEmpty(value)) {
            return 'Одна из норм должна быть заполнена';
          }
          return '';
        },
      ],
    },
    car_id: {
      title: 'Рег. номер ТС',
      type: 'valueOfArray',
      required: false,
    },
    car_special_model_id: {
      title: 'Модель ТС',
      type: 'valueOfArray',
      required: true,
    },
    car_model_id: {
      title: 'Марка шасси',
      type: 'valueOfArray',
      required: true,
    },
  },
};
