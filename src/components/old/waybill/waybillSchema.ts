import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { WaybillFormWrapProps } from 'components/old/waybill/WaybillFormWrap';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { getTrailers } from 'components/old/waybill/utils';
import { getRequiredFieldToFixed, getMinLengthError } from 'components/@next/@utils/getErrorString/getErrorString';
import { hasMotohours, isEmpty } from 'utils/functions';
import { isNumber, isArray, isString, isNullOrUndefined } from 'util';
import { makeFuelCardIdOptions } from 'components/old/waybill/table_input/utils';
import memoizeOne from 'memoize-one';
import { RefillType } from 'redux-main/reducers/modules/refill_type/@types/refillType';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';

const isValidToFixed3 = (data) => {
  return /^[ +]?[0-9]*[\\.,]?[0-9]{1,3}$/.test(data);
};

const validateFuelCardId = (
  rowData: ValuesOf<Waybill['car_refill']>,
  refillTypeList: Array<RefillType>,
  fuelCardsList: Array<FuelCard>,
  fuel_type: Waybill['fuel_type'],
  notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
  formState,
) => {
  let fuel_card_id = '';
  const needSelectFuelCard = !rowData.fuel_card_id;

  const availableFuelCard = makeFuelCardIdOptions(
    fuelCardsList,
    [rowData],
    notFiltredFuelCardsIndex,
  );

  const IS_CLOSED = formState.status === 'close';
  const IS_DELETE = formState?.delete;

  const isValidSelectedFuelCard = availableFuelCard.some(
    (optionData) => optionData.rowData.id === rowData.fuel_card_id,
  );

  if (needSelectFuelCard) {
    if (!availableFuelCard.length && rowData.type_id === 1) {
      fuel_card_id
        = 'Необходимо добавить топливную карту в справочнике "НСИ-Транспортные средства-Реестр топливных карт" или создать по кнопке "Создать топл.карту"';
    } else if(rowData.type_id === 1 && !IS_CLOSED && !IS_DELETE) {
      fuel_card_id = 'Поле "Топливная карта" должно быть заполнено';
    }
  } else if (rowData.fuel_card_id) {
    const currentFuelCardData = availableFuelCard.find(
      (optionData) => optionData.rowData.id === rowData.fuel_card_id,
    );

    const fuel_type_selected_fuel_card = currentFuelCardData?.rowData?.fuel_type;
    if (fuel_type_selected_fuel_card !== fuel_type) {
      fuel_card_id
        = 'Необходимо выбрать топливную карту с типом топлива, указанным в путевом листе';
    }
  }

  if (!isValidSelectedFuelCard && rowData.fuel_card_id) {
    // если выбрана топливная карта, но ее нет в списке, который приходит с бека
    return 'Укажите актуальную топливную карту';
  }

  return fuel_card_id;
};

const checkCarRefill = memoizeOne(
  (
    car_refill: Waybill['car_refill'] = [],
    refillTypeList: Array<RefillType>,
    fuelCardsList: Array<FuelCard>,
    fuel_type: Waybill['fuel_type'],
    notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
    formState,
  ) => {
    return car_refill.map((rowData) => {
      return {
        type_id: !rowData.type_id
          ? 'Поле "Способ заправки" должно быть заполнено'
          : '',
        fuel_card_id: validateFuelCardId(
          rowData,
          refillTypeList,
          fuelCardsList,
          fuel_type,
          notFiltredFuelCardsIndex,
          formState,
        ),
        value: rowData.type_id === 2 || (rowData.type_id === 1 && rowData.fuel_card_id)
          ? !rowData.value && rowData.value !== 0
            ? 'Поле "Выдано, л" должно быть заполнено'
            : rowData.value < 0
              ? 'Поле "Выдано, л" должно быть больше не отрицательным числом'
              : (formState.status === 'active' || formState.status === 'draft' || !formState.status)
              && rowData.value > 1000 ? 'Значение в поле "Выдано, л" должно быть не больше 1000'
                : !isValidToFixed3(rowData.value)
                  ? getRequiredFieldToFixed('Выдано, л', 3)
                  : ''
          : '',
      };
    });
  },
);
const checkEquipmentCarRefill = memoizeOne(
  (
    car_refill: Waybill['car_refill'] = [],
    refillTypeList: Array<RefillType>,
    fuelCardsList: Array<FuelCard>,
    fuel_type: Waybill['fuel_type'],
    notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
    formState,
  ) => {
    return car_refill.map((rowData) => {
      return {
        type_id: !rowData.type_id
          ? 'Поле "Способ заправки" должно быть заполнено'
          : '',
        fuel_card_id: validateFuelCardId(
          rowData,
          refillTypeList,
          fuelCardsList,
          fuel_type,
          notFiltredFuelCardsIndex,
          formState,
        ),
        value: rowData.type_id === 2 || (rowData.type_id === 1 && rowData.fuel_card_id)
          ? !rowData.value && rowData.value !== 0
            ? 'Поле "Выдано, л" должно быть заполнено'
            : (formState.status === 'active' || formState.status === 'draft' || !formState.status)
            && rowData.value > 1000 ? 'Значение в поле "Выдано, л" должно быть не больше 1000'
              : !isValidToFixed3(rowData.value)
                ? getRequiredFieldToFixed('Выдано, л', 3)
                : ''
          : '',
      };
    });
  },
);

const checkTaxData = (tax_data: Waybill['tax_data']) => {
  return tax_data.map((rowData) => {
    return {
      OPERATION: !rowData.OPERATION
        ? 'Поле "Операция" должно быть заполнено'
        : '',
      FACT_VALUE:
        !rowData.FACT_VALUE && rowData.FACT_VALUE !== 0
          ? 'Поле "Значение" должно быть заполнено'
          : '',
    };
  });
};
export const waybillSchema: SchemaType<Waybill, WaybillFormWrapProps> = {
  properties: {
    plan_departure_date: {
      title: 'Выезд план.',
      type: 'datetime',
      required: true,
      dependencies: [
        (value, { status }, reduxState) => {
          const moscowTimeServer = reduxState.moscowTimeServer;

          if (status === 'active' || status === 'closed' || status === 'deleted') {
            return false;
          }

          if (diffDates(moscowTimeServer.date, value, 'minutes', false) > 5) {
            return 'Значение "Выезд. план" не может быть меньше текущего времени минус 5 минут';
          }

          return false;
        },
      ],
    },
    plan_arrival_date: {
      title: 'Возвращение план.',
      type: 'datetime',
      required: true,
      dependencies: [
        (plan_arrival_date, { plan_departure_date, status }) => {
          const IS_CLOSED = status && status === 'closed';
          if (
            plan_arrival_date
            && plan_departure_date
            && diffDates(plan_arrival_date, plan_departure_date, 'days', true) > 31
            && !IS_CLOSED
          ) {
            return 'Дата "Возвращение план." не должна превышать дату "Выезд план." больше чем на 31 день';
          }

          return false;
        },
        (plan_arrival_date, { plan_departure_date, status }) => {
          const IS_CLOSED = status && status === 'closed';
          if (plan_arrival_date && plan_departure_date && !IS_CLOSED) {
            if (diffDates(plan_arrival_date, plan_departure_date) <= 0) {
              return '"Возвращение план." должно быть больше "Выезд план."';
            }
          }
          return false;
        },
      ],
    },
    driver_id: {
      title: 'Водитель',
      type: 'number',
      required: true,
    },
    car_id: {
      title: 'Транспортное средство',
      type: 'number',
      required: true,
    },
    trailer_id: {
      title: 'Прицеп',
      type: 'number',
      required: false,
      dependencies: [
        (
          value,
          { structure_id, status },
          { carList },
        ) => {
          const getTrailersByStructId = getTrailers(structure_id, null);
          const TRAILERS = getTrailersByStructId(carList);
          const correctTrailer = TRAILERS.find((elem) => elem.value === value);
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);

          if (value && !correctTrailer && fieldNotHidden) {
            return 'В данный момент выбранный прицеп не подходят для заполнения';
          }

          return false;
        },
      ],
    },
    fuel_start: {
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
      dependencies: [
        (value, { status }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Топливо.Выезд', 3);
          }
        },
      ],
    },
    equipment_fuel_type: {
      title: 'Тип топлива',
      type: 'valueOfArray',
      required: false,
      dependencies: [
        (value, { equipment_fuel, is_one_fuel_tank, status }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && (status === 'active' || status === 'draft' || !status)
            && !value
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      ],
    },
    equipment_fuel_start: {
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
      required: false,
      dependencies: [
        (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Топливо.Выезд', 3);
          }
        },
      ],
    },
    fuel_type: {
      title: 'Топливо.Тип',
      type: 'string',
      dependencies: [
        (value, { status }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && !value
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      ],
    },
    fuel_given: {
      title: 'Выдано, л',
      type: 'number',
      float: 3,
      required: false,
    },
    equipment_fuel_given: {
      title: 'Выдано, л',
      type: 'number',
      float: 3,
      required: false,
    },
    fuel_to_give: {
      title: 'Топливо.Выдать',
      type: 'number',
      float: 3,
      required: false,
    },
    equipment_fuel_to_give: {
      title: 'Топливо.Выдать',
      type: 'number',
      float: 3,
      required: false,
    },
    odometr_start: {
      title: 'Одометр.Выезд',
      type: 'number',
      integer: true,
      required: false,
      dependencies: [
        (value, formData) => {
          if ((!hasMotohours(formData.gov_number) || formData.car_has_odometr) && isEmpty(value)) {
            return 'Поле "Одометр.Выезд" должно быть заполнено';
          }
          return false;
        },
      ],
    },
    odometr_reason_id: {
      title: 'Причина изменения показателя выезда.',
      type: 'number',
      integer: true,
      required: false,
      dependencies: [
        (value, formData) => {
          if (formData.is_edited_odometr) {
            if (isEmpty(value)) {
              return 'Поле "Причина изменения показателя выезда." должно быть заполнено';
            }
          }
          return false;
        },
      ],
    },
    motohours_start: {
      title: 'Счетчик моточасов.Выезд',
      type: 'number',
      integer: true,
      required: false,
      dependencies: [
        (value, formData) => {
          if ((hasMotohours(formData.gov_number) || formData.car_has_motohours) && isEmpty(value)) {
            return 'Поле "Счетчик моточасов.Выезд" должно быть заполнено';
          }
          return false;
        },
      ],
    },
    motohours_reason_id: {
      title: 'Причина изменения показателя выезда.',
      type: 'number',
      integer: true,
      required: false,
      dependencies: [
        (value, formData) => {
          if (formData.is_edited_motohours) {
            if (isEmpty(value)) {
              return 'Поле "Причина изменения показателя выезда." должно быть заполнено';
            }
          }
          return false;
        },
      ],
    },
    motohours_equip_start: {
      title: 'Счетчик моточасов оборудования.Выезд',
      type: 'number',
      integer: true,
      dependencies: [
        (value, formData) => {
          if (
            formData.equipment_fuel
            && (!formData.status || formData.status === 'draft')
            && isEmpty(value)
          ) {
            return 'Поле "Счетчик моточасов оборудования.Выезд" должно быть заполнено';
          }
          return false;
        },
      ],
    },
    motohours_equip_reason_id: {
      title: 'Причина изменения показателя выезда.',
      type: 'number',
      integer: true,
      required: false,
      dependencies: [
        (value, formData) => {
          if (formData.is_edited_motohours_equip) {
            if (isEmpty(value)) {
              return 'Поле "Причина изменения показателя выезда." должно быть заполнено';
            }
          }
          return false;
        },
      ],
    },
    files: {
      title: 'Файл',
      type: 'multiValueOfArray',
      dependencies: [
        (files, formData) => {
          if (formData.is_edited_odometr || formData.is_edited_motohours || formData.is_edited_motohours_equip) {
            return {
              odometr: (formData.is_edited_odometr && !(files && files.some((file) => file.kind === 'odometr' && file.action !== 'delete')))
                ? 'Поле "Файл" должно быть заполнено'
                : false,
              motohours: (formData.is_edited_motohours && !(files && files.some((file) => file.kind === 'motohours' && file.action !== 'delete')))
                ? 'Поле "Файл" должно быть заполнено'
                : false,
              motohours_equip: (formData.is_edited_motohours_equip && !(files && files.some((file) => file.kind === 'motohours_equip' && file.action !== 'delete')))
                ? 'Поле "Файл" должно быть заполнено'
                : false,
            };
          }
          return false;
        },
      ],
    },
    downtime_hours_work: {
      title: 'Работа',
      type: 'number',
      float: 2,
      min: 0,
      max: 1000,
      alt_min: true,
    },
    downtime_hours_duty: {
      title: 'Дежурство',
      required: false,
      type: 'number',
      float: 2,
      min: 0,
      max: 1000,
      alt_min: true,
    },
    downtime_hours_dinner: {
      title: 'Обед',
      required: false,
      type: 'number',
      float: 2,
      min: 0,
      max: 1000,
      alt_min: true,
    },
    downtime_hours_repair: {
      title: 'Ремонт',
      required: false,
      type: 'number',
      float: 2,
      min: 0,
      max: 1000,
      alt_min: true,
    },
    car_refill: {
      title: 'car_refill',
      type: 'multiValueOfArray',
      dependencies: [
        (
          car_refill,
          formState,
          { refillTypeList, fuelCardsList, notFiltredFuelCardsIndex },
        ) => {
          return checkCarRefill(
            car_refill,
            refillTypeList,
            fuelCardsList,
            formState.fuel_type,
            notFiltredFuelCardsIndex,
            formState,
          );
        },
      ],
    },
    equipment_refill: {
      title: 'equipment_refill',
      type: 'multiValueOfArray',
      dependencies: [
        (
          equipment_refill,
          formState,
          { refillTypeList, equipmentFuelCardsList, notFiltredFuelCardsIndex },
        ) => {
          return checkEquipmentCarRefill(
            equipment_refill,
            refillTypeList,
            equipmentFuelCardsList,
            formState.equipment_fuel_type,
            notFiltredFuelCardsIndex,
            formState,
          );
        },
      ],
    },
    car_has_motohours: {
      title: 'На ТС установлен счетчик моточасов',
      type: 'boolean',
      dependencies: [
        (_, { gov_number, status, car_has_motohours }) => {
          const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
          const IS_DRAFT = status === 'draft';
          const IS_ACTIVE = status === 'active';
          if ((!status || IS_DRAFT || IS_ACTIVE) && CAR_HAS_ODOMETER && isNullOrUndefined(car_has_motohours)) {
            return 'Поле "На ТС установлен счетчик моточасов" должно быть заполнено';
          }
          return false;
        }
      ],
    },
    car_has_odometr: {
      title: 'На ТС установлен одометр',
      type: 'boolean',
      dependencies: [
        (_, { gov_number, status, car_has_odometr }) => {
          const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
          const IS_DRAFT = status === 'draft';
          const IS_ACTIVE = status === 'active';
          if ((!status || IS_DRAFT || IS_ACTIVE) && !CAR_HAS_ODOMETER && isNullOrUndefined(car_has_odometr)) {
            return 'Поле "На ТС установлен одометр" должно быть заполнено';
          }
          return false;
        }
      ],
    },
    equipment_fuel: {
      title: 'На ТС установлено спецоборудование',
      type: 'boolean',
      dependencies: [
        (_, {status, equipment_fuel }) => {
          const IS_DRAFT = status === 'draft';
          const IS_ACTIVE = status === 'active';
          if ((!status || IS_DRAFT || IS_ACTIVE) && isNullOrUndefined(equipment_fuel)) {
            return 'Поле "На ТС установлено спецоборудование" должно быть заполнено';
          }
          return false;
        }
      ],
    },
  },
};

export const waybillClosingSchema: SchemaType<Waybill, WaybillFormWrapProps> = {
  properties: {
    ...waybillSchema.properties,
    fact_departure_date: {
      title: 'Выезд факт.',
      type: 'datetime',
      dependencies: [
        (value, { status }) => {
          const IS_ACTIVE = status && status === 'active';

          if (IS_ACTIVE && !value) {
            return 'Поле "Выезд факт." должно быть заполнено';
          }
          return false;
        },
        (value, { plan_departure_date, status }) => {
          const IS_CLOSED = status && status === 'closed';
          if (
            value
            && diffDates(value, plan_departure_date, 'minutes', false) < 0
            && !IS_CLOSED
          ) {
            return '"Выезд факт." должно быть не раньше "Выезда план."';
          }
          return false;
        },
      ],
    },
    fact_arrival_date: {
      title: 'Возвращение факт.',
      type: 'datetime',
      dependencies: [
        (value, { status }) => {
          const IS_ACTIVE = status && status === 'active';

          if (IS_ACTIVE && !value) {
            return 'Поле "Возвращение факт." должно быть заполнено';
          }
          return false;
        },
        (value, { fact_departure_date, status }) => {
          const IS_CLOSED = status && status === 'closed';
          if (
            value
            && fact_departure_date
            && diffDates(value, fact_departure_date, 'minutes', false) <= 0
            && !IS_CLOSED
          ) {
            return '"Возвращение факт." должно быть позже "Выезд факт."';
          }
          return false;
        },
        (value, { plan_arrival_date, status }) => {
          const IS_CLOSED = status && status === 'closed';
          if (value && plan_arrival_date && !IS_CLOSED) {
            const isMoreThen180 = diffDates(value, plan_arrival_date, 'minutes', false) > 180;

            if (isMoreThen180) {
              return 'Время, указанное в поле "Возвращение факт" не может превышать время в поле "Возвращение план" больше чем на 3 часа';
            }
          }
          return false;
        }
      ],
    },
    fuel_end: {
      title: 'Возврат по таксировке, л',
      type: 'number',
      dependencies: [
        (value, { status, }) => {
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);
          if (
            fieldNotHidden
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат по таксировке, л" должно быть заполнено';
          }
        },
      ],
    },
    fact_fuel_end: {
      title: 'Топливо.Возврат фактический',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && status === 'active'
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Возврат фактический, л', 3);
          }
        },
      ],
    },
    equipment_fact_fuel_end: {
      title: 'Топливо.Возврат фактический',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, { status, equipment_fuel, is_one_fuel_tank }) => {
          if (
            equipment_fuel
            && !is_one_fuel_tank
            && status === 'active'
            && (!value && value !== 0)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Возврат фактический, л', 3);
          }
        },
      ],
    },
    odometr_end: {
      title: 'Одометр. Возвращение в гараж, км',
      type: 'number',
      integer: true,
      dependencies: [
        (value, { odometr_start, gov_number, car_has_odometr, status }) => {
          const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
          if (status !== 'deleted' && (CAR_HAS_ODOMETER || car_has_odometr)) {
            if ((odometr_start || isNumber(odometr_start)) && (!value && value !== 0)) { // Поправить это в ЧТЗ, поля невсегда обязательны
              return 'Поле "Одометр. Возвращение в гараж, км" должно быть заполнено';
            }
            if (value && Number(value) < Number(odometr_start)) {
              return '"Одометр. Возвращение в гараж, км" должно быть не меньше значения "Одометр.Выезд"';
            }
          }
          return false;
        },
      ],
    },
    motohours_end: {
      title: 'Счетчик моточасов.Возвращение в гараж, м/ч',
      type: 'number',
      integer: true,
      dependencies: [
        (value, { motohours_start, gov_number, car_has_motohours, status }) => {
          const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
          if (status !== 'deleted' && (!CAR_HAS_ODOMETER || car_has_motohours)) {
            if ((motohours_start || isNumber(motohours_start)) && (!value && value !== 0)) {
              return 'Поле "Счетчик моточасов.Возвращение в гараж, м/ч" должно быть заполнено';
            }
            if (value && value < motohours_start) {
              return '"Счетчик моточасов.Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов.Выезд"';
            }
          }
          return false;
        }
      ],
    },
    motohours_equip_end: {
      title: 'Счетчик моточасов оборудования. Возвращение в гараж, м/ч',
      type: 'number',
      integer: true,
      dependencies: [
        (value, { motohours_equip_start, equipment_fuel, status }) => {
          if (equipment_fuel && status !== 'deleted') {
            if (
              (motohours_equip_start || isNumber(motohours_equip_start))
              && (!value && value !== 0)
            ) {
              return 'Поле "Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть заполнено';
            }
            if (value && value < motohours_equip_start) {
              return '"Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов оборудования.Выезд"';
            }
          }
          return false;
        }
      ],
    },
    comment: {
      title: 'Комментарий',
      type: 'string',
      dependencies: [
        (value, { status }) => {
          const minLength = 4000;
          if(status !== 'deleted' && value && isString(value) && value.length > minLength ) {
            return getMinLengthError(minLength);
          }
        }
      ],
    },
    equipment_tax_data: {
      title: 'Расчет топлива по норме для оборудования',
      type: 'multiValueOfArray',
      dependencies: [
        (value, { equipment_fuel, hasEquipmentFuelRates, motohours_equip_diff}) => {
          if (
            equipment_fuel
            && hasEquipmentFuelRates
            && (!isArray(value) || (isArray(value) && !value.length))
            && motohours_equip_diff > 0
          ) {
            return 'В поле "Расчет топлива по норме для оборудования" необходимо добавить операцию';
          }
        }
      ],
    },
    tax_data: {
      title: 'Расчет топлива по норме',
      type: 'multiValueOfArray',
      dependencies: [
        (value, {odometr_diff, motohours_diff, gov_number}) => {
          const CAR_HAS_ODOMETER = gov_number ? !hasMotohours(gov_number) : null;
          if (
            (!isArray(value) || (isArray(value) && !value.length))
              && (CAR_HAS_ODOMETER ? odometr_diff > 0 : motohours_diff > 0)
          ) {
            return 'В поле "Расчет топлива по норме" необходимо добавить операцию';
          }
        }
      ],
    },
    equipment_tax_data_rows: {
      title: 'Расчет топлива по норме для оборудования(таблица)',
      type: 'multiValueOfArray',
      dependencies: [
        (
          _,
          { equipment_tax_data, equipment_fuel, hasEquipmentFuelRates },
        ) => {
          if (equipment_fuel && hasEquipmentFuelRates) {
            return checkTaxData(equipment_tax_data);
          }
        },
      ],
    },
    tax_data_rows: {
      title: 'Расчет топлива по норме(таблица)',
      type: 'multiValueOfArray',
      dependencies: [
        (_, { tax_data, equipment_fuel, hasEquipmentFuelRates }) => {
          if ((isArray(tax_data) && tax_data.length)) {
            return checkTaxData(tax_data);
          }
        },
      ],
    },
    distance: {
      title: 'Пройдено по Глонасс, км',
      required: false,
      type: 'number',
      dependencies: [
        (value, {odometr_diff, motohours_diff, status}) => {
          const IS_CLOSED = status && status === 'closed';
          const abs = Math.abs(
            parseFloat((odometr_diff || motohours_diff || 0).toString())
            - parseFloat((value ?? 0).toString()),
          );
          if (abs / 100 > 0.1 && !IS_CLOSED) {
            return 'Расхождение в показателях пробега';
          }
          return false;
        },
      ],
    },
  },
};
