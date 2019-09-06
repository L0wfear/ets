import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { BlockCarInfoProps } from './@types/BlockCarInfo';
import { CarsConditionCars } from 'redux-main/reducers/modules/inspect/cars_condition/@types/inspect_cars_condition';
import { get } from 'lodash';

export const carsConditionCarFormDataSchema: SchemaType<CarsConditionCars['data'], BlockCarInfoProps> = {
  properties: {
    tech_inspection_passed: {
      type: 'valueOfArray',
      title: 'Технический осмотр пройден',
      required: true,
    },
    glonass_stationary: {
      type: 'valueOfArray',
      title: 'ГЛОНАСС стационарный',
      required: true,
    },
    glonass_registered: {
      type: 'valueOfArray',
      title: 'ГЛОНАСС зарегистрирован',
      required: true,
    },
    tech_condition: {
      type: 'valueOfArray',
      title: 'Техническое состояние',
      required: true,
    },
    logo: {
      type: 'valueOfArray',
      title: 'Логотип',
      required: true,
    },
  },
};

export const carsConditionCarFormSchema: SchemaType<CarsConditionCars, BlockCarInfoProps> = {
  properties: {
    gov_number: {
      validateIf: {
        type: 'has_data',
        path: 'id',
        reverse: true,
      },
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
    environmental_class: {
      type: 'valueOfArray',
      title: 'Экологический стандарт ТС',
      required: true,
    },
    engine_type: {
      type: 'valueOfArray',
      title: 'Тип двигателя',
      required: true,
    },
    kind: {
      type: 'valueOfArray',
      title: 'Вид техники',
      required: true,
    },
    kind_purchase: {
      type: 'valueOfArray',
      title: 'Вид приобретения',
      required: true,
    },
    origin_country: {
      type: 'valueOfArray',
      title: 'Страна изготовитель',
      required: true,
    },
    max_weight: {
      title: 'Разрешенная максимальная масса, кг',
      type: 'number',
      float: 2,
      required: true,
    },
    vin: {
      type: 'string',
      title: 'VIN',
      maxLength: 17,
    },
    gby_district: {
      type: 'string',
      title: 'gby_district',
      required: true,
    },
    gby_operation_district: {
      type: 'string',
      title: 'gby_operation_district',
      required: true,
    },
    vin_by_hand: {
      type: 'string',
      title: 'VIN (ручной ввод)',
      maxLength: 17,
    },
    body_number: {
      type: 'string',
      title: 'Заводской номер (из системы)',
      maxLength: 128,
    },
    body_number_by_hand: {
      type: 'string',
      title: 'Заводской номер (ручной ввод)',
      maxLength: 128,
    },
    manufactured_at: {
      type: 'number',
      title: 'Год выпуска',
      maxLength: 4,
      integer: true,
      minNotEqual: -1,
      required: true,
    },
    given_at: {
      type: 'date',
      title: 'Дата регистрации',
      required: true,
    },
    exploitation_date_start: {
      type: 'date',
      title: 'Дата начала эксплуатации',
      required: true,
    },
    odometr_fact: {
      type: 'number',
      title: 'Пробег на дату проведения последнего ТО',
      required: false,
    },
    motohours_fact: {
      type: 'number',
      title: 'Наработка м/ч на дату проведения последнего ТО',
      required: false,
    },
    osago: {
      type: 'string',
      title: 'Номер ОСАГО',
      dependencies: [
        (value, formState) => {
          if (( !get(formState, 'data.osago_not_required', null) || !get(formState, 'osago_not_required', null)) && !value) {
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
          if (( !get(formState, 'data.osago_not_required', null) || !get(formState, 'osago_not_required', null)) && !value) {
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
      title: 'Дата прохождения последнего ТО шасси',
    },
    last_inspection_equipment: {
      type: 'date',
      title: 'Дата прохождения последнего ТО спецоборудования',
    },
    mileage: {
      type: 'number',
      title: 'Пробег на дату проведения проверки',
    },
    motohours: {
      type: 'number',
      title: 'Наработка м/ч на дату проверки',
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
