import moment from 'moment';

import { isEmpty, hasMotohours } from 'utils/functions';
import { diffDates, getDateWithMoscowTz } from 'utils/dates';
import { getTrailers } from 'components/waybill/utils';
import { get } from 'lodash';
import { isArray } from 'util';
import memoizeOne from 'memoize-one';
import { makeFuelCardIdOptions } from 'components/waybill/table_input/utils';

const validateFuelCardId = (
  rowData,
  car_refill,
  refillTypeList,
  fuelCardsList,
  fuel_type,
  userCompanyId,
  structure_id,
) => {
  let fuel_card_id = '';
  const needSelectFuelCard
    = !rowData.fuel_card_id
    && get(
      refillTypeList.find(({ id }) => id === rowData.type_id),
      'is_fuel_card_required',
      false,
    );

  const availableFuelCard = makeFuelCardIdOptions(
    fuelCardsList,
    car_refill,
    fuel_type,
    userCompanyId,
    structure_id,
  );

  if (needSelectFuelCard) {
    if (!availableFuelCard.length) {
      fuel_card_id
        = 'Необходимо добавить топливную карту в справочнике "НСИ-Транспортные средства-Реестр топливных карт" или создать по кнопке "Создать топл.карту"';
    } else {
      fuel_card_id = 'Поле "Топливная карта" должно быть заполнено';
    }
  } else if (fuel_card_id) {
    const currentFuelCardData = availableFuelCard.find(
      (optionData) => optionData.rowData.id === rowData.fuel_card_id,
    );

    const fuel_type_selected_fuel_card = get(
      currentFuelCardData,
      'rowData.fuel_type',
    );
    if (fuel_type_selected_fuel_card !== fuel_type) {
      fuel_card_id
        = 'Необходимо выбрать топливную карту с типом топлива, указанным в путевом листе';
    }
  }

  return fuel_card_id;
};

const checkCarRefill = memoizeOne(
  (
    car_refill,
    refillTypeList,
    fuelCardsList,
    fuel_type,
    userCompanyId,
    structure_id,
  ) => {
    return car_refill.map((rowData) => {
      return {
        type_id: !rowData.type_id
          ? 'Поле "Способ заправки" должно быть заполнено'
          : '',
        fuel_card_id: validateFuelCardId(
          rowData,
          car_refill,
          refillTypeList,
          fuelCardsList,
          fuel_type,
          userCompanyId,
          structure_id,
        ),
        value:
          !rowData.value && rowData.value !== 0
            ? 'Поле "Выдано, л" должно быть заполнено'
            : rowData.value < 0
              ? 'Поле "Выдано, л" должно быть больше не отрицательным числом'
              : '',
      };
    });
  },
);

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
      key: 'car_refill',
      title: 'car_refill',
    },
    {
      key: 'equipment_refill',
      title: 'equipment_refill',
    },
  ],
  dependencies: {
    car_refill: [
      {
        validator: (
          car_refill,
          formState,
          { refillTypeList, fuelCardsList, userCompanyId },
        ) => {
          return checkCarRefill(
            car_refill,
            refillTypeList,
            fuelCardsList,
            formState.fuel_type,
            userCompanyId,
            formState.structure_id,
          );
        },
      },
    ],
    equipment_refill: [
      {
        validator: (
          equipment_refill,
          formStatet,
          { refillTypeList, fuelCardsList, userCompanyId, userStructureId },
        ) => {
          return checkCarRefill(
            equipment_refill,
            refillTypeList,
            fuelCardsList,
            formStatet.equipment_fuel_type,
            userCompanyId,
            userStructureId,
          );
        },
      },
    ],
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
        validator: (plan_arrival_date, { plan_departure_date, status }) => {
          if (
            !(status === 'active' || status === 'closed')
            && plan_arrival_date
            && plan_departure_date
            && diffDates(plan_arrival_date, plan_departure_date, 'days', true) > 31
          ) {
            return 'Дата "Возвращение план." не должна превышать дату "Выезд план." больше чем на 31 день';
          }

          return false;
        },
      },
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

          return false;
        },
      },
    ],
    fuel_type: [
      {
        validator: (value, { status }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && !value
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fuel_type: [
      {
        validator: (value, { equipment_fuel, is_one_fuel_tank, status }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && (status === 'active' || status === 'draft' || !status)
            && !value
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      },
    ],
    fuel_start: [
      {
        validator: (value, { status }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fuel_start: [
      {
        validator: (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
        },
      },
    ],
    equipment_fact_fuel_end: [
      {
        validator: (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
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
        validator: (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && status === 'active'
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
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
  },
  {
    key: 'motohours_end',
    title: 'Счетчик моточасов.Возвращение в гараж, м/ч',
    type: 'number',
    integer: true,
  },
  {
    key: 'motohours_equip_end',
    title: 'Счетчик моточасов оборудования. Возвращение в гараж, м/ч',
    type: 'number',
    integer: true,
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
  odometr_end: [
    {
      validator(value, { odometr_start, gov_number }) {
        const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
        if (CAR_HAS_ODOMETER) {
          if (odometr_start && !value) {
            return 'Поле "Одометр. Возвращение в гараж, км" должно быть заполнено';
          }
          if (value && value < odometr_start) {
            return '"Одометр. Возвращение в гараж, км" должно быть не меньше значения "Одометр.Выезд"';
          }
        }
        return false;
      },
    },
  ],
  motohours_end: [
    {
      validator(value, { motohours_start, gov_number }) {
        const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
        if (!CAR_HAS_ODOMETER) {
          if (motohours_start && !value) {
            return 'Поле "Счетчик моточасов.Возвращение в гараж, м/ч" должно быть заполнено';
          }
          if (value && value < motohours_start) {
            return '"Счетчик моточасов.Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов.Выезд"';
          }
        }
        return false;
      },
    },
  ],
  motohours_equip_end: [
    {
      validator(value, { motohours_equip_start, equipment_fuel }) {
        if (equipment_fuel) {
          if (motohours_equip_start && !value) {
            return 'Поле "Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть заполнено';
          }
          if (value && value < motohours_equip_start) {
            return '"Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов оборудования.Выезд"';
          }
        }
        return false;
      },
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
