import moment from 'moment';

import { isEmpty, hasMotohours } from 'utils/functions';
import { diffDates, getDateWithMoscowTz } from 'utils/dates';
import { isArray } from 'highcharts';
import { getTrailers } from 'components/waybill/utils';
import { get } from 'lodash';

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
    motohours_equip_start: [
      {
        validator: (value, formData) => {
          if (
            formData.equipment_fuel
            && (!formData.status || formData.status === 'draft')
            && isEmpty(value)
          ) {
            return 'Поле "Счетчик моточасов оборудования.Выезд" должно быть заполнено';
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
        validator: (value, formData, props) => {
          // проверка на соответствие подразделений в ПЛ и топливной карты
          const { fuelCardsList } = props;
          const fuelCardsElem = fuelCardsList.find((fuelCard) => {
            return fuelCard.id === formData.fuel_card_id;
          });

          const userCompanyId = get(props, 'userData.company_id');
          if (
            fuelCardsElem
            && (!formData.status || formData.status === 'draft')
          ) {
            if (
              formData.fuel_method !== 'naliv'
              && fuelCardsElem.structure_id !== formData.structure_id
              && !fuelCardsElem.is_common
            ) {
              return 'Подразделение в топливной карте не совпадает с подразделением, указанным в путевом листе. Выберите другую топливную карту.';
            }
            if (
              formData.fuel_method !== 'naliv'
              && fuelCardsElem.company_id !== userCompanyId
              && !fuelCardsElem.is_common
            ) {
              return 'Выбранная топливная карта не привязана к Вашей организации. Выберите другую топливную карту.';
            }
          }

          return false;
        },
      },
    ],
    fuel_method: [
      {
        validator: (value, formData) => {
          if (!value && (!formData.status || formData.status === 'draft')) {
            return 'Поле "Способ заправки" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    equipment_fuel_card_id: [
      {
        validator: (value, formData, props) => {
          // проверка на соответствие подразделений в ПЛ и топливной карты
          const { fuelCardsList } = props;
          const equipmentFuelCardsElem = fuelCardsList.find((fuelCard) => {
            return fuelCard.id === formData.equipment_fuel_card_id;
          });

          const userCompanyId = get(props, 'userData.company_id');
          if (
            equipmentFuelCardsElem
            && (!formData.status || formData.status === 'draft')
          ) {
            if (
              formData.equipment_fuel_method !== 'naliv'
              && formData.equipment_fuel
              && equipmentFuelCardsElem.structure_id !== formData.structure_id
              && !equipmentFuelCardsElem.is_common
            ) {
              return 'Подразделение в топливной карте не совпадает с подразделением, указанным в путевом листе. Выберите другую топливную карту.';
            }

            if (
              formData.equipment_fuel_method !== 'naliv'
              && formData.equipment_fuel
              && equipmentFuelCardsElem.company_id !== userCompanyId
              && !equipmentFuelCardsElem.is_common
            ) {
              return 'Выбранная топливная карта не привязана к Вашей организации. Выберите другую топливную карту.';
            }
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
            && (formData.status === 'draft' || !formData.status)
          ) {
            return 'Поле "Способ заправки" должно быть заполнено';
          }
          return false;
        },
      },
    ],
    fuel_type: [
      {
        validator: (value, { status }) => {
          if ((status === 'draft' || !status) && !value) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fuel_type: [
      {
        validator: (value, { equipment_fuel, status }) => {
          if (equipment_fuel && (status === 'draft' || !status) && !value) {
            return 'Поле "Тип топлива" должно быть заполнено';
          }
        },
      },
    ],
    fuel_start: [
      {
        validator: (value, { status }) => {
          if ((status === 'draft' || !status) && (!value && value !== 0)) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fuel_start: [
      {
        validator: (value, { status, equipment_fuel }) => {
          if (
            equipment_fuel
            && (status === 'draft' || !status)
            && (!value && value !== 0)
          ) {
            return 'Поле "Выезд, л" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fact_fuel_end: [
      {
        validator: (value, { status, equipment_fuel }) => {
          if (
            equipment_fuel
            && status === 'active'
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
        },
      },
    ],
    fact_fuel_end: [
      {
        validator: (value, { status, equipment_fuel }) => {
          if (
            equipment_fuel
            && status === 'active'
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
        },
      },
    ],
    trailer_id: [
      {
        validator: (
          value,
          { structure_id, status },
          { isPermittedByKey, carsList },
        ) => {
          const getTrailersByStructId = getTrailers(structure_id, null);
          const TRAILERS = getTrailersByStructId(carsList);
          const correctTrailer = TRAILERS.find((elem) => elem.value === value);
          const fieldDisabled = get(isPermittedByKey, 'update', false);
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);

          if (value && !fieldDisabled && !correctTrailer && fieldNotHidden) {
            return 'В данный момент выбранный прицеп не подходят для заполнения';
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
      validator: (value, { equipment_fuel, hasEquipmentFuelRates }) => {
        if (
          equipment_fuel
          && hasEquipmentFuelRates
          && (!isArray(value)
            || !value.filter(
              ({ FACT_VALUE, OPERATION }) =>
                (FACT_VALUE || FACT_VALUE === 0) && OPERATION,
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
