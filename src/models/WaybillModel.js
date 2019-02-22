import moment from 'moment';

import { isEmpty, hasMotohours } from 'utils/functions';
import { diffDates, getDateWithMoscowTz } from 'utils/dates';
import { isNullOrUndefined, isNumber } from 'util';
import { isArray } from 'highcharts';

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
      key: 'equipment_fuel_type',
      title: 'Тип топлива',
      type: 'valueOfArray',
      required: false,
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
      integer: true,
      required: false,
    },
    {
      key: 'motohours_start',
      title: 'Счетчик моточасов.Выезд',
      type: 'number',
      integer: true,
      required: false,
    },
    {
      key: 'motohours_equip_start',
      title: 'Счетчик моточасов оборудования.Выезд',
      type: 'number',
      integer: true,
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
    },
    {
      key: 'downtime_hours_duty',
      title: 'Дежурство',
      required: false,
      type: 'number',
    },
    {
      key: 'downtime_hours_dinner',
      title: 'Обед',
      required: false,
      type: 'number',
    },
    {
      key: 'downtime_hours_repair',
      title: 'Ремонт',
      required: false,
      type: 'number',
    },
    {
      key: 'fuel_method',
      title: 'Способ заправки',
      required: false,
      type: 'string',
    },
    {
      key: 'fuel_card_id',
      title: 'Топливная карта',
      required: false, // dependencies valid
      type: 'string',
    },
    {
      key: 'equipment_fuel_method',
      title: 'Способ заправки',
      required: false,
      type: 'string',
    },
    {
      key: 'equipment_fuel_card_id',
      title: 'Топливная карта',
      required: false, // dependencies valid
      type: 'string',
    },
  ],
  dependencies: {
    plan_departure_date: [
      {
        validator: (value, { status }) => {
          // а надо ли?
          if (status === 'active' || status === 'closed') {
            return false;
          }

          if (
            diffDates(getDateWithMoscowTz(), moment('2018-11-10T00:00:00')) < 0
          ) {
            // уже не работает
            return '';
          }
          if (moment(new Date()).diff(moment(value), 'minutes') > 5) {
            return 'Значение "Выезд. план" не может быть меньше текущего времени минус 5 минут';
          }

          return false;
        },
      },
    ],
    odometr_start: [
      {
        validator: (value, formData) => {
          if (!hasMotohours(formData.gov_number) && isEmpty(value)) {
            return 'Поле "Одометр.Выезд" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    motohours_start: [
      {
        validator: (value, formData) => {
          if (hasMotohours(formData.gov_number) && isEmpty(value)) {
            return 'Поле "Счетчик моточасов.Выезд" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    plan_arrival_date: [
      {
        type: 'gt',
        field: 'plan_departure_date',
      },
    ],
    downtime_hours_work: [
      {
        validator: (value) => {
          if (
            value
            && parseFloat(value)
              .toFixed(1)
              .match(/^\d{4,}/)
          ) {
            return 'Поле "Работа" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_duty: [
      {
        validator: (value) => {
          if (
            value
            && parseFloat(value)
              .toFixed(1)
              .match(/^\d{4,}/)
          ) {
            return 'Поле "Дежурство" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_dinner: [
      {
        validator: (value) => {
          if (
            value
            && parseFloat(value)
              .toFixed(1)
              .match(/^\d{4,}/)
          ) {
            return 'Поле "Обед" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    downtime_hours_repair: [
      {
        validator: (value) => {
          if (
            value
            && parseFloat(value)
              .toFixed(1)
              .match(/^\d{4,}/)
          ) {
            return 'Поле "Ремонт" должно быть меньше 1000';
          }
          return false;
        },
      },
    ],
    fuel_card_id: [
      {
        validator: (value, formData) => {
          if (
            !value
            && formData.fuel_method === 'fuel_card'
            && (formData.status === 'draft' || !formData.status)
          ) {
            return 'Поле "Топливная карта" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    fuel_method: [
      {
        validator: (value, formData) => {
          if (!value && formData.status === 'draft') {
            return 'Поле "Способ заправки" должно быть заполнено';
          }
          if (
            value === 'fuel_card'
            && isEmpty(formData.fuel_card_id)
            && (formData.status === 'draft' || !formData.status)
          ) {
            return 'Поле "Топливная карта" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    equipment_fuel_card_id: [
      {
        validator: (value, formData) => {
          if (
            !value
            && formData.equipment_fuel
            && formData.equipment_fuel_method === 'fuel_card'
            && (formData.status === 'draft' || !formData.status)
          ) {
            return 'Поле "Топливная карта" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    equipment_fuel_method: [
      {
        validator: (value, formData) => {
          if (
            !value
            && formData.equipment_fuel
            && formData.status === 'draft'
            && formData.equipment_fuel
          ) {
            return 'Поле "Способ заправки" должно быть заполнено';
          }
          if (
            value === 'fuel_card'
            && formData.equipment_fuel
            && isEmpty(formData.equipment_fuel_card_id)
            && (formData.status === 'draft' || !formData.status)
          ) {
            return 'Поле "Топливная карта" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    equipment_fuel_type: [
      {
        validator: (value, { equipment_fuel, motohours_equip_start }) => {
          if (
            equipment_fuel
            && !isNullOrUndefined(motohours_equip_start)
            && isNullOrUndefined(value)
          ) {
            return 'Поле "Тип топлива" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fuel_start: [
      {
        validator: (value, { equipment_fuel, motohours_equip_start }) => {
          if (
            equipment_fuel
            && !isNullOrUndefined(motohours_equip_start)
            && isNullOrUndefined(value)
          ) {
            return 'Поле "Выезд, л" должно быть заполнено';
          }
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
  },
  {
    key: 'fact_arrival_date',
    title: 'Возвращение факт.',
    type: 'datetime',
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
    title: 'Топливо.Возврат по таксировке',
    type: 'number',
    float: 3,
    required: true,
  },
  {
    key: 'fact_fuel_end',
    title: 'Топливо.Возврат фактический',
    type: 'number',
    float: 3,
    min: 0,
  },
  {
    key: 'equipment_fuel_end',
    title: 'Топливо.Возврат',
    type: 'number',
    float: 3,
    required: false,
  },
  {
    key: 'equipment_fact_fuel_end',
    title: 'Топливо.Возврат фактический',
    type: 'number',
    float: 3,
    min: 0,
  },
  {
    key: 'odometr_end',
    title: 'Одометр. Возвращение в гараж, км',
    type: 'number',
    integer: true,
    required: 'odometr_start',
  },
  {
    key: 'motohours_end',
    title: 'Счетчик моточасов.Возвращение в гараж, м/ч',
    type: 'number',
    integer: true,
    required: 'motohours_start',
  },
  {
    key: 'motohours_equip_end',
    title: 'Счетчик моточасов оборудования. Возвращение в гараж, м/ч',
    type: 'number',
    integer: true,
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
    maxLength: 200,
  },
  {
    key: 'equipment_tax_data',
    title: 'Расчет топлива по норме для оборудования',
    type: 'array',
  },
];

const closingDependencies = {
  ...waybillSchema.dependencies,
  motohours_end: [
    {
      type: 'gte',
      field: 'motohours_start',
    },
  ],
  motohours_equip_end: [
    {
      type: 'gte',
      field: 'motohours_equip_start',
    },
  ],
  odometr_end: [
    {
      type: 'gte',
      field: 'odometr_start',
    },
  ],
  fact_departure_date: [
    {
      validator(value, { status }) {
        const IS_ACTIVE = status && status === 'active';
        const IS_CLOSED = status && status === 'closed';

        if ((IS_ACTIVE || IS_CLOSED) && !value) {
          return 'Поле "Выезд факт." должно быть заполнено';
        }
        return false;
      },
    },
    {
      validator(value, { plan_departure_date }) {
        if (
          value
          && moment(value).diff(moment(plan_departure_date), 'minutes') < 0
        ) {
          return '"Выезд факт." должно быть не раньше "Выезда план."';
        }
        return false;
      },
    },
  ],
  fact_arrival_date: [
    {
      validator(value, { status }) {
        const IS_ACTIVE = status && status === 'active';
        const IS_CLOSED = status && status === 'closed';

        if ((IS_ACTIVE || IS_CLOSED) && !value) {
          return 'Поле "Возвращение факт." должно быть заполнено';
        }
        return false;
      },
    },
    {
      validator(value, { fact_departure_date }) {
        if (
          value
          && fact_departure_date
          && moment(value).diff(moment(fact_departure_date), 'minutes') <= 0
        ) {
          return '"Возвращение факт." должно быть позже "Выезд факт."';
        }
        return false;
      },
    },
    {
      validator(value, { plan_arrival_date }) {
        if (
          value
          && plan_arrival_date
          && moment(value).diff(moment(plan_arrival_date), 'minutes') > 180
        ) {
          return 'Время, указанное в поле "Возвращение факт" не может превышать время в поле "Возвращение план" больше чем на 3 часа';
        }
        return false;
      },
    },
  ],
  distance: [
    {
      validator: (value, formData) => {
        const abs = Math.abs(
          parseFloat(formData.odometr_diff || formData.motohours_diff || 0)
            - parseFloat(value || 0),
        );
        if (abs / 100 > 0.1) {
          return 'Расхождение в показателях пробега';
        }
        return false;
      },
    },
  ],
  equipment_tax_data: [
    {
      validator: (
        value,
        { equipment_fuel, motohours_equip_start, hasEquipmentFuelRates },
      ) => {
        if (
          equipment_fuel
          && hasEquipmentFuelRates
          && !isNullOrUndefined(motohours_equip_start)
          && (!isArray(value)
            || !value.filter(
              ({ FACT_VALUE, OPERATION }) =>
                isNumber(FACT_VALUE) && isNumber(OPERATION),
            ).length)
        ) {
          return 'В Поле "Расчет топлива по норме для оборудования" необходимо добавить операцию';
        }
      },
    },
  ],
};

export const waybillClosingSchema = {
  properties: closingProperties,
  dependencies: closingDependencies,
};
