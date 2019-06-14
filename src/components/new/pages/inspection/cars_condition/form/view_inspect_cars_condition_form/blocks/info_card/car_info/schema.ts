import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { BlockCarInfoProps } from './@types/BlockCarInfo';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';

export const carsConditionCarFormDataSchema: SchemaType<CarsConditionCars['data'], BlockCarInfoProps> = {
  properties: {
    fact_mileage: {
      type: 'number',
      title: 'Фактический пробег / счетчик моточасов',
      required: true,
    },
  },
};

export const carsConditionCarFormSchema: SchemaType<CarsConditionCars, BlockCarInfoProps> = {
  properties: {
    gov_number: {
      type: 'string',
      title: 'Гос. номер',
      required: true,
      maxLength: 9,
    },
    marka: {
      type: 'valueOfArray',
      title: 'Марка',
      required: true,
    },
    model: {
      type: 'valueOfArray',
      title: 'Модель',
      required: true,
    },
    type: {
      type: 'valueOfArray',
      title: 'Тип ТС',
      required: true,
    },
    vin: {
      type: 'string',
      title: 'VIN',
      maxLength: 17,
    },
    mileage: {
      type: 'number',
      title: 'Пробег на дату проведения последнего ТО',
      required: false,
    },
    motohours: {
      type: 'number',
      title: 'Наработка м/ч на дату проведения последнего ТО',
      required: false,
    },
    osago: {
      type: 'string',
      title: 'Номер ОСАГО',
      dependencies: [
        (value, formState) => {
          if (!formState.data.osago_not_required && !value) {
            return 'Поле "Номер ОСАГО" должно быть заполнено';
          }
        },
      ],
    },
    osago_finished_at: {
      type: 'date',
      title: 'Действует до',
      dependencies: [
        (value, formState) => {
          if (!formState.data.osago_not_required && !value) {
            return 'Поле "Действует до" должно быть заполнено';
          }
        },
      ],
    },
    diagnostic_card: {
      type: 'string',
      title: 'Номер диагностической карты',
      required: true,
    },
    diagnostic_card_finished_at: {
      type: 'date',
      title: 'Действует до',
      required: true,
    },
    last_tech_inspection_date: {
      type: 'date',
      title: 'Дата прохождения последнего ТО',
      required: true,
    },
    fact_status: {
      type: 'valueOfArray',
      title: 'Фактический статус ТС',
      required: true,
    },
    status_at_check: {
      type: 'valueOfArray',
      title: 'Нахождение ТС на момент проверки',
      required: true,
    },
    state_exploitation: {
      type: 'valueOfArray',
      title: 'Состояние эксплуатации',
      required: true,
    },
    season: {
      type: 'valueOfArray',
      title: 'Сезон',
      required: true,
    },
    data: {
      type: 'schema',
      schema: carsConditionCarFormDataSchema,
    },
  },
};
