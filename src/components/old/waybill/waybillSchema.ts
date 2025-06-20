import { SchemaType } from 'components/old/ui/form/new/@types/validate.h';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { WaybillFormWrapProps } from 'components/old/waybill/WaybillFormWrap';
import { diffDates } from 'components/@next/@utils/dates/dates';
import { getTrailers } from 'components/old/waybill/utils';
import { getRequiredFieldToFixed, getMinLengthError } from 'components/@next/@utils/getErrorString/getErrorString';
import { isMotoHoursMileageType, isEmpty } from 'utils/functions';
import { isNumber, isArray, isString, isNullOrUndefined } from 'util';
import { makeFuelCardIdOptions } from 'components/old/waybill/table_input/utils';
import memoizeOne from 'memoize-one';
import { RefillType } from 'redux-main/reducers/modules/refill_type/@types/refillType';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { IStateCompany } from 'redux-main/reducers/modules/company/@types';
import { ELECTRICAL_ENGINE_TYPE_ID, GAS_ENGINE_TYPE_ID, FUEL_ENGINE_TYPE_ID } from 'components/new/pages/nsi/autobase/pages/car_actual/form/body_container/main_tabs/info/inside_fields/engine_data/FieldSelectEngine';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';

const isValidToFixed1 = (data) => {
  return /^[ +]?[0-9]*[\\.,]?[0-9]$/.test(data);
};

const isValidToFixed3 = (data) => {
  return /^[ +]?[0-9]*[\\.,]?[0-9]{1,3}$/.test(data);
};

const validateFuelCardId = (
  rowData: ValuesOf<Waybill['car_refill']>,
  refillTypeList: Array<RefillType>,
  fuelCardsList: Array<FuelCard>,
  companyList: IStateCompany['companyList'],
  userCompanyId: InitialStateSession['userData']['company_id'],
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

  const IS_CLOSED = formState.status === 'closed';
  const IS_DELETE = formState.status === 'deleted';

  const isValidSelectedFuelCard = availableFuelCard.some(
    (optionData) => optionData.rowData.id === rowData.fuel_card_id && !optionData.isNotVisible
  );

  const selectedFuelCard = rowData.fuel_card_id && notFiltredFuelCardsIndex[rowData.fuel_card_id];

  if (needSelectFuelCard) {
    if (!availableFuelCard.length && rowData.type_id === 1) {
      if (!companyList?.find((company) => company.company_id === userCompanyId).fuel_cards_creating) {
        fuel_card_id
          = 'Необходимо добавить топливную карту в справочнике "НСИ-Транспортные средства-Реестр топливных карт"';
      } else {
        fuel_card_id
          = 'Необходимо добавить топливную карту в справочнике "НСИ-Транспортные средства-Реестр топливных карт" или создать по кнопке "Создать топл.карту"';
      }
    } else if (rowData.type_id === 1 && !IS_CLOSED && !IS_DELETE) {
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

  if ((!IS_CLOSED || formState.closed_editable) && !isValidSelectedFuelCard && rowData.fuel_card_id) {
    // если выбрана топливная карта, но ее нет в списке, который приходит с бека
    return 'Укажите актуальную топливную карту';
  }

  if (selectedFuelCard?.status === 'locked' && !IS_CLOSED && !IS_DELETE) {
    return 'Выбранная топливная карта заблокирована';
  }

  return fuel_card_id;
};

const checkCarRefill = memoizeOne(
  (
    car_refill: Waybill['car_refill'] = [],
    refillTypeList: Array<RefillType>,
    fuelCardsList: Array<FuelCard>,
    userCompanyId: InitialStateSession['userData']['company_id'],
    fuel_type: Waybill['fuel_type'],
    notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
    formState,
    companyList: IStateCompany['companyList'],
  ) => {
    return car_refill.map((rowData) => {
      return {
        type_id: !rowData.type_id
          ? 'Поле "Способ заправки" должно быть заполнено'
          : companyList.find((company) => company.use_pouring === false) && rowData.type_id === 2
          && (formState.status !== 'closed' && formState.status !== 'deleted' && fuel_type !== 'ELECTRICITY')
            ? 'Выбранный способ заправки больше недоступен для вашей организации. Пожалуйста, выберите другой способ заправки'
            : '',
        fuel_card_id: validateFuelCardId(
          rowData,
          refillTypeList,
          fuelCardsList,
          companyList,
          userCompanyId,
          fuel_type,
          notFiltredFuelCardsIndex,
          formState,
        ),
        date: !rowData.date
          ? 'Поле "Дата заправки" должно быть заполнено'
          : '',
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
    userCompanyId: InitialStateSession['userData']['company_id'],
    fuel_type: Waybill['fuel_type'],
    notFiltredFuelCardsIndex: Record<FuelCard['id'], FuelCard>,
    formState,
    companyList: IStateCompany['companyList'],
  ) => {
    return car_refill.map((rowData) => {
      return {
        type_id: !rowData.type_id
          ? 'Поле "Способ заправки" должно быть заполнено'
          : companyList.find((company) => company.use_pouring === false) && rowData.type_id === 2
          && (formState.status !== 'closed' && formState.status !== 'deleted')
            ? 'Выбранный способ заправки больше недоступен для вашей организации. Пожалуйста, выберите другой способ заправки'
            : '',
        date: !rowData.date
          ? 'Поле "Дата заправки" должно быть заполнено'
          : '',
        fuel_card_id: validateFuelCardId(
          rowData,
          refillTypeList,
          fuelCardsList,
          companyList,
          userCompanyId,
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
          { structure_id, status, car_id, mission_id_list },
          { carList, carIndex, selectedMissions },
        ) => {
          const getTrailersByStructId = getTrailers(structure_id, null);
          const TRAILERS = getTrailersByStructId(carList);
          const correctTrailer = TRAILERS.find((elem) => elem.value === value);
          const IS_CLOSED = status && status === 'closed';
          const isTrailerRequired = carIndex[car_id]?.is_trailer_required && !IS_CLOSED;
          const isTrailerRequiredMission = selectedMissions.some(({ is_trailer_required }) => is_trailer_required);
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);
          const isMissionListExists = mission_id_list?.length > 0;

          if (value && !correctTrailer && fieldNotHidden) {
            return 'В данный момент выбранный прицеп не подходит для заполнения';
          }

          if (!value && correctTrailer || !value && isTrailerRequired && isTrailerRequiredMission && isMissionListExists) {
            return 'Поле "Прицеп" должно быть заполнено';
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
        (value, { status, engine_kind_ids }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
            && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Топливо.Выезд', 3);
          }
        },
      ],
    },
    gas_fuel_start: {
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
            && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value) && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID) ) {
            return getRequiredFieldToFixed('Топливо.Выезд', 3);
          }
        },
      ],
    },
    electrical_fuel_start: {
      title: 'Топливо.Выезд',
      type: 'number',
      float: 3,
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && (!value && value !== 0)
            && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Топливо.Выезд" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value) && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID) ) {
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
        (value, { status, engine_kind_ids }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && !value
            && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      ],
    },
    gas_fuel_type: {
      title: 'Топливо.Тип',
      type: 'string',
      dependencies: [
        (value, { status, engine_kind_ids, }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && !value && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Топливо.Тип" должно быть заполнено';
          }
        },
      ],
    },
    electrical_fuel_type: {
      title: 'Топливо.Тип',
      type: 'string',
      dependencies: [
        (value, { status, engine_kind_ids, }) => {
          if (
            (status === 'active' || status === 'draft' || !status)
            && !value && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)
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
    gas_fuel_given: {
      title: 'Выдано, л',
      type: 'number',
      float: 3,
      required: false,
    },
    electrical_fuel_given: {
      title: 'Выдано, кВт',
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
        (value, formData,) => {
          if ((!isMotoHoursMileageType(formData.mileage_type_id) || formData.car_has_odometr) && isEmpty(value)) {
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
      float: 1,
      required: false,
      dependencies: [
        (value, formData,) => {
          if ((isMotoHoursMileageType(formData.mileage_type_id) || formData.car_has_motohours) && isEmpty(value)) {
            return 'Поле "Счетчик моточасов.Выезд" должно быть заполнено';
          }
          if (value && !isValidToFixed1(value)) {
            return getRequiredFieldToFixed('Счетчик моточасов.Выезд', 1);
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
      float: 1,
      dependencies: [
        (value, formData) => {
          if (
            formData.equipment_fuel
            && (!formData.status || formData.status === 'draft' || formData.status === 'active')
            && isEmpty(value)
          ) {
            return 'Поле "Счетчик моточасов оборудования.Выезд" должно быть заполнено';
          }
          if (value && !isValidToFixed1(value)) {
            return getRequiredFieldToFixed('Счетчик моточасов оборудования.Выезд', 1);
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
          { refillTypeList, fuelCardsList, notFiltredFuelCardsIndex, companyList, userCompanyId },
        ) => {
          if(formState.engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)){
            return checkCarRefill(
              car_refill,
              refillTypeList,
              fuelCardsList,
              userCompanyId,
              formState.fuel_type,
              notFiltredFuelCardsIndex,
              formState,
              companyList
            );
          }
        },
      ],
    },
    gas_refill: {
      title: 'gas_refill',
      type: 'multiValueOfArray',
      dependencies: [
        (
          gas_refill,
          formState,
          { refillTypeList, gasFuelCardsList, notFiltredFuelCardsIndex, companyList, userCompanyId},
        ) => {
          if(formState.engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)) {
            return checkCarRefill(
              gas_refill,
              refillTypeList,
              gasFuelCardsList,
              userCompanyId,
              formState.gas_fuel_type,
              notFiltredFuelCardsIndex,
              formState,
              companyList
            );
          }
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
          { refillTypeList, equipmentFuelCardsList, notFiltredFuelCardsIndex, companyList, userCompanyId },
        ) => {
          return checkEquipmentCarRefill(
            equipment_refill,
            refillTypeList,
            equipmentFuelCardsList,
            userCompanyId,
            formState.equipment_fuel_type,
            notFiltredFuelCardsIndex,
            formState,
            companyList
          );
        },
      ],
    },
    electrical_refill: {
      title: 'electrical_refill',
      type: 'multiValueOfArray',
      dependencies: [
        (
          electrical_refill,
          formState,
          { refillTypeList, electricalFuelCardsList, notFiltredFuelCardsIndex, companyList, userCompanyId },
        ) => {
          if(formState.engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)) {
            return checkCarRefill(
              electrical_refill,
              refillTypeList,
              electricalFuelCardsList,
              userCompanyId,
              formState.electrical_fuel_type,
              notFiltredFuelCardsIndex,
              formState,
              companyList
            );
          }
        },
      ],
    },
    car_has_motohours: {
      title: 'На ТС установлен счетчик моточасов',
      type: 'boolean',
      dependencies: [
        (_, { status, car_has_motohours, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
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
        (_, { status, car_has_odometr, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
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
        (value, { status, engine_kind_ids, }) => {
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);
          if (
            fieldNotHidden
            && (!value && value !== 0)
            && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат по таксировке, л" должно быть заполнено';
          }
        },
      ],
    },
    gas_fuel_end: {
      title: 'Возврат по таксировке, л',
      type: 'number',
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);
          if (
            fieldNotHidden
            && (!value && value !== 0)
            && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат по таксировке, л" должно быть заполнено';
          }
        },
      ],
    },
    electrical_fuel_end: {
      title: 'Возврат по таксировке, кВт',
      type: 'number',
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          const IS_CREATING = status;
          const IS_DRAFT = status && status === 'draft';
          const fieldNotHidden = !(IS_CREATING || IS_DRAFT);
          if (
            fieldNotHidden
            && (!value && value !== 0)
            && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат по таксировке, кВт" должно быть заполнено';
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
        (value, { status, engine_kind_ids }) => {
          if (
            status === 'active'
            && (!value && value !== 0)
            && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Возврат фактический, л', 3);
          }
        },
      ],
    },
    gas_fact_fuel_end: {
      title: 'Топливо.Возврат фактический',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          if (
            status === 'active'
            && (!value && value !== 0)
            && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат фактический, л" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Возврат фактический, л', 3);
          }
        },
      ],
    },
    electrical_fact_fuel_end: {
      title: 'Топливо.Возврат фактический',
      type: 'number',
      float: 3,
      min: 0,
      dependencies: [
        (value, { status, engine_kind_ids }) => {
          if (
            status === 'active'
            && (!value && value !== 0)
            && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)
          ) {
            return 'Поле "Возврат фактический, кВт" должно быть заполнено';
          }
          if(value && !isValidToFixed3(value)) {
            return getRequiredFieldToFixed('Возврат фактический, кВт', 3);
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
        (value, { odometr_start, car_has_odometr, status, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
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
      float: 1,
      dependencies: [
        (value, { motohours_start, car_has_motohours, status, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
          if (status !== 'deleted' && (!CAR_HAS_ODOMETER || car_has_motohours)) {
            if ((motohours_start || isNumber(motohours_start)) && (!value && value !== 0)) {
              return 'Поле "Счетчик моточасов.Возвращение в гараж, м/ч" должно быть заполнено';
            }
            if (value && value < motohours_start) {
              return '"Счетчик моточасов.Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов.Выезд"';
            }
            if (value && !isValidToFixed1(value)) {
              return getRequiredFieldToFixed('Счетчик моточасов.Возвращение в гараж, м/ч', 1);
            }
          }
          return false;
        }
      ],
    },
    motohours_equip_end: {
      title: 'Счетчик моточасов оборудования. Возвращение в гараж, м/ч',
      type: 'number',
      float: 1,
      dependencies: [
        (value, { motohours_equip_start, equipment_fuel, status }) => {
          if (equipment_fuel && status !== 'deleted') {
            if (
              (motohours_equip_start || isNumber(motohours_equip_start))
              && (!value && value !== 0)
            ) {
              return 'Поле "Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть заполнено';
            }
            if (value && +value < +motohours_equip_start) {
              return '"Счетчик моточасов оборудования. Возвращение в гараж, м/ч" должно быть не меньше значения "Счетчик моточасов оборудования.Выезд"';
            }
            if (value && !isValidToFixed1(value)) {
              return getRequiredFieldToFixed('Счетчик моточасов оборудования. Возвращение в гараж, м/ч', 1);
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
        (value, { equipment_fuel, hasEquipmentFuelRates, motohours_equip_diff, engine_kind_ids}) => {
          if (
            equipment_fuel
            && hasEquipmentFuelRates
            && (!isArray(value) || (isArray(value) && !value.length))
            && motohours_equip_diff > 0
            && !engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)
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
        (_, {gas_tax_data, electrical_tax_data, tax_data, odometr_diff, motohours_diff, engine_kind_ids, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
          let taxes = [];
          if(isArray(gas_tax_data)){
            taxes = [...taxes, ...gas_tax_data];
          }
          if(isArray(electrical_tax_data)){
            taxes = [...taxes, ...electrical_tax_data];
          }
          if(isArray(tax_data)){
            taxes = [...taxes, ...tax_data];
          }
          if (
            (!isArray(taxes) || (isArray(taxes) && !taxes.length))
              && (CAR_HAS_ODOMETER ? odometr_diff > 0 : motohours_diff > 0)
              && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'В поле "Расчет топлива по норме" необходимо добавить операцию';
          }
        }
      ],
    },
    gas_tax_data: {
      title: 'Расчет газа по норме',
      type: 'multiValueOfArray',
      dependencies: [
        (_, {gas_tax_data, tax_data, odometr_diff, motohours_diff, engine_kind_ids, mileage_type_id }) => {
          const CAR_HAS_ODOMETER = mileage_type_id ? !isMotoHoursMileageType(mileage_type_id) : null;
          let taxes = [];
          if(isArray(gas_tax_data)){
            taxes = [...taxes, ...gas_tax_data];
          }
          if(isArray(tax_data)){
            taxes = [...taxes, ...tax_data];
          }
          if (
            (!isArray(taxes) || (isArray(taxes) && !taxes.length))
              && (CAR_HAS_ODOMETER ? odometr_diff > 0 : motohours_diff > 0)
              && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'В поле "Расчет газа по норме" необходимо добавить операцию';
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
        (_, { tax_data, engine_kind_ids }) => {
          if ((isArray(tax_data) && tax_data.length && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID))) {
            return checkTaxData(tax_data);
          }
        },
      ],
    },
    gas_tax_data_rows: {
      title: 'Расчет газа по норме(таблица)',
      type: 'multiValueOfArray',
      dependencies: [
        (_, { gas_tax_data, engine_kind_ids }) => {
          if ((isArray(gas_tax_data) && gas_tax_data.length) && engine_kind_ids?.includes(GAS_ENGINE_TYPE_ID)) {
            return checkTaxData(gas_tax_data);
          }
        },
      ],
    },
    electrical_tax_data_rows: {
      title: 'Расчет ЭЭ по норме(таблица)',
      type: 'multiValueOfArray',
      dependencies: [
        (_, { electrical_tax_data, engine_kind_ids }) => {
          if ((isArray(electrical_tax_data) && electrical_tax_data.length) && engine_kind_ids?.includes(ELECTRICAL_ENGINE_TYPE_ID)) {
            return checkTaxData(electrical_tax_data);
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
    is_no_fuel_refill: {
      title: 'Заправок не было',
      type: 'boolean',
      dependencies: [
        (value, {car_refill, engine_kind_ids}) => {
          if(
            !value 
            && !car_refill.length 
            && engine_kind_ids?.includes(FUEL_ENGINE_TYPE_ID)
          ) {
            return 'Добавьте заправку или укажите, что ее не было';
          }
          return false;
        },
      ],
    },
    is_no_equipment_refill: {
      title: 'Заправок не было',
      type: 'boolean',
      dependencies: [
        (value, {equipment_refill, is_one_fuel_tank, equipment_fuel}) => {
          if(
            equipment_fuel
            && !value 
            && !equipment_refill.length
            && !is_one_fuel_tank
          ) {
            return 'Добавьте заправку или укажите, что ее не было';
          }
          return false;
        },
      ],
    },
    is_no_gas_refill: {
      title: 'Заправок не было',
      type: 'boolean',
      dependencies: [
        (value, {gas_refill, engine_kind_ids}) => {
          if(
            !value 
            && !gas_refill.length
            && engine_kind_ids.includes(GAS_ENGINE_TYPE_ID)
          ) {
            return 'Добавьте заправку или укажите, что ее не было';
          }
          return false;
        },
      ],
    },
    is_no_electrical_refill: {
      title: 'Заправок не было',
      type: 'boolean',
      dependencies: [
        (value, {electrical_refill, engine_kind_ids}) => {
          if(
            !value 
            && !electrical_refill.length
            && engine_kind_ids.includes(ELECTRICAL_ENGINE_TYPE_ID)
          ) {
            return 'Добавьте заправку или укажите, что ее не было';
          }
          return false;
        },
      ],
    },
  },
};
