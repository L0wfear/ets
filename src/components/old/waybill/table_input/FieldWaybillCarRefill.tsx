import * as React from 'react';
import { get, keyBy } from 'lodash';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

import TableInput, { TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { DisplayFlexAlignCenterFooterForm, FooterEnd } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import CarRefillTableHeader from './CarRefillTableHeader';
import { fuelCardsGetAndSetInStore, equipmentFuelCardsGetAndSetInStore, gasFuelCardsGetAndSetInStore } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { makeFuelCardIdOptions } from './utils';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { HrLineWaybill } from 'components/new/pages/login/styled/styled';
import { createValidDate, createValidDateTime, dateInPeriod, diffDates } from 'components/@next/@utils/dates/dates';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { isObject } from 'util';
import { FuelCardOnCars } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { defaultFuelCardOnCarsItem } from 'components/new/pages/nsi/autobase/pages/fuel_cards/form/FuelCardsForm';
import { isNullOrUndefined } from 'util';
import { WaybillState } from 'components/old/waybill/WaybillForm';

type Props = {
  id: string;
  errors: Array<any>;
  title: string;
  handleChange: (refill: Waybill['car_refill']) => any;
  defaultHandleChange: any;
  IS_DRAFT_OR_ACTIVE: boolean;

  disabled?: boolean;
  page: string;
  path?: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];
  car_id: Waybill['car_id'];
  date_for_valid: {
    fact_departure_date: Waybill['fact_departure_date'];
    plan_departure_date: Waybill['plan_departure_date'];
    plan_arrival_date: Waybill['plan_arrival_date'];
    fact_arrival_date: Waybill['fact_arrival_date'];
  };
  waybill_status: Waybill['status'];
  closed_editable: Waybill['closed_editable'];
  is_one_fuel_tank?: boolean;
  use_pouring?: boolean;
  fuel_cards_creating?: boolean;
  boundKey: string;
  fuelCardsList: IStateAutobase['fuelCardsList'] | IStateAutobase['equipmentFuelCardsList'] | IStateAutobase['gasFuelCardsList'] | IStateAutobase['electricalFuelCardsList'];
  is_refill: boolean;
  is_refill_error: any;
  canEditIfClose: boolean;
  gov_number?: Waybill['gov_number'];
  lastWaybill: WaybillState['lastWaybill'];
} & (
  {
    array: Waybill['car_refill'];
    arrayOrigin: Waybill['car_refill'];
    fuel_given: Waybill['fuel_given'];
    fuel_type: Waybill['fuel_type'];
  } | {
    array: Waybill['equipment_refill'];
    arrayOrigin: Waybill['equipment_refill'];
    fuel_given: Waybill['equipment_fuel_given'];
    fuel_type: Waybill['equipment_fuel_type'];
  } | {
    array: Waybill['gas_refill'];
    arrayOrigin: Waybill['gas_refill'];
    fuel_given: Waybill['gas_fuel_given'];
    fuel_type: Waybill['gas_fuel_type'];
  } | {
    array: Waybill['electrical_refill'];
    arrayOrigin: Waybill['electrical_refill'];
    fuel_given: Waybill['electrical_fuel_given'];
    fuel_type: Waybill['electrical_fuel_type'];
  }
);

const metaTypeId: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill'] | Waybill['gas_refill'] | Waybill['electrical_refill']>> = {
  key: 'type_id',
  title: 'Способ заправки',
  format: 'select',
  width: 200,
  options: [],
  uniqValueInCol: true,
};

const metaFuelCardId: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill'] | Waybill['electrical_refill']>> = {
  key: 'fuel_card_id',
  title: 'Топливная карта',
  placeholder: '',
  format: 'select',
  onChange: (onChange) => (value, option) => {
    onChange({
      fuel_card_id: value,
      number: get(option, 'label') || null,
    });
  },
  width: 200,
  options: [],
};

const metaCarRefillDate: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'date',
  title: 'Дата заправки',
  format: 'date',
  width: 70,
  time: false,
};

const metaValue: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill'] | Waybill['electrical_refill']>> = {
  key: 'value',
  title: 'Выдано, л',
  width: 100,
  format: 'toFixed3',
};

const storeFuelCardsKey = {
  equipment_refill: 'equipmentFuelCardsList',
  car_refill: 'fuelCardsList',
  gas_refill: 'gasFuelCardsList',
  electrical_refill: 'electricalFuelCardsList',
};

const FieldWaybillCarRefill: React.FC<Props> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
    const notFiltredFuelCardsIndex = etsUseSelector((state) => getAutobaseState(state).notFiltredFuelCardsIndex);
    const dispatch = etsUseDispatch();
    const isEquipmentRefilBlock = props.boundKey === 'equipment_refill';
    const isCarRefilBlock = props.boundKey === 'car_refill';
    const isGasRefilBlock = props.boundKey === 'gas_refill';
    const isElectricalRefilBlock = props.boundKey === 'electrical_refill';
    
    const isPermittedWaybillRefill = etsUseSelector((state) => getSessionState(state).userData.permissionsSet.has(waybillPermissions.refill));
    const fuelCardsList = !isNullOrUndefined(props.boundKey)
      ? etsUseSelector((state) => getAutobaseState(state)[storeFuelCardsKey[props.boundKey]])
      : [];
    const [needUpdateRefillDate, setNeedUpdateRefillDate] = React.useState(false);
    const refillTypeList = etsUseSelector((state) => getSomeUniqState(state).refillTypeList); // <<< gas
    const fact_departure_date = createValidDateTime(get(props, 'date_for_valid.fact_departure_date'));
    const fact_arrival_date = createValidDateTime(get(props, 'date_for_valid.fact_arrival_date'));

    const plan_departure_date = createValidDateTime(get(props, 'date_for_valid.plan_departure_date'));
    const plan_arrival_date = createValidDateTime(get(props, 'date_for_valid.plan_arrival_date'));
    const validPeriod = React.useMemo(() => {
      return fact_departure_date && fact_arrival_date
        ? {
          date_start: fact_departure_date,
          date_end: fact_arrival_date,
        }
        : {
          date_start: plan_departure_date,
          date_end: plan_arrival_date,
        };
    }, [fact_departure_date, fact_arrival_date, plan_departure_date, plan_arrival_date]);

    const fuelCardIdOptions = React.useMemo(
      () => {
        return makeFuelCardIdOptions(
          fuelCardsList,
          props.array,
          notFiltredFuelCardsIndex,
        );
      },
      [
        fuelCardsList,
        props.array,
        notFiltredFuelCardsIndex,
      ],
    );

    const typeIdOptions = React.useMemo(
      () => {
        return refillTypeList.map((rowData) => ({
          value: rowData.id,
          label: rowData.name,
          isNotVisible: !rowData.is_selectable,
          isDisabled: rowData.id === 2 && !props.use_pouring,
          rowData,
        }));
      },
      [refillTypeList, props.use_pouring],
    );

    const metaCarRefillRaw = React.useMemo(
      () => {
        const meta: Array<TableMeta<ValuesOf<Waybill['car_refill']>>> = [
          {
            ...metaTypeId,
            options: typeIdOptions,
            disabled: isGasRefilBlock || isElectricalRefilBlock,
            default_value: isGasRefilBlock ? 1 : isElectricalRefilBlock ? 2 : null,
          },
          {
            ...metaFuelCardId,
            options: fuelCardIdOptions,
            disabled: isElectricalRefilBlock,
          },
          {
            ...metaCarRefillDate,
            min: validPeriod.date_start ? new Date(validPeriod.date_start) : null, 
            max: validPeriod.date_end ? new Date(validPeriod.date_end) : null,
          },
          {
            ...metaValue,
            title: props.fuel_type !== 'ELECTRICITY' ? metaValue.title : 'Выдано, кВт',
            disabled: !props.array[selectedRowIndex]?.type_id
              || (
                props.array[selectedRowIndex]?.type_id === 1
                && !props.array[selectedRowIndex]?.fuel_card_id
              ),
          }
        ];

        return meta;
      },
      [fuelCardIdOptions, typeIdOptions, props.array, selectedRowIndex, isGasRefilBlock, isElectricalRefilBlock, validPeriod],
    );

    const handleUpdateFuelCard = React.useCallback(
      async () => {
        const payload: any = {};

        if (props.car_id) {
          payload.car_id = props.car_id;
        }
        if (props.fuel_type) {
          payload.fuel_type = props.fuel_type;
        }

        payload.date_start = validPeriod.date_start;
        payload.date_end = validPeriod.date_end;
        payload.is_archive = false;
        payload.status = 'Active';

        if (isCarRefilBlock) {
          dispatch(fuelCardsGetAndSetInStore(
            {
              ...payload,
            },
            {
              page: props.page,
              path: props.path,
            },
          ));
        } else if (isEquipmentRefilBlock) {
          dispatch(equipmentFuelCardsGetAndSetInStore(
            {
              ...payload,
            },
            {
              page: props.page,
              path: props.path,
            },
          ));
        } else if (isGasRefilBlock) {
          dispatch(gasFuelCardsGetAndSetInStore(
            {
              ...payload,
            },
            {
              page: props.page,
              path: props.path,
            },
          ));
        }
      },
      [
        props.car_id,
        props.fuel_type,
        fact_departure_date,
        plan_departure_date,
        props.page,
        props.path,
        fact_arrival_date,
        plan_arrival_date,
        isCarRefilBlock,
        isEquipmentRefilBlock,
        isGasRefilBlock,
        isElectricalRefilBlock,
        validPeriod,
      ],
    );

    React.useEffect(
      () => {
        handleUpdateFuelCard();
      }, [
        handleUpdateFuelCard,
      ],
    );

    const fuelCardValue = React.useMemo(
      () => props.array.map(
        ( data ) => data.fuel_card_id,
      ),
      [props.array],
    );

    const previousfuelCardValue = usePrevious(fuelCardValue);

    const handleChange = React.useCallback(
      async (array: Props['array'], rowIndex?: number, cellValue?: number, cellKey?: string) => {
        let newArr = array;
        const filteredFuelCardIdOptions = fuelCardIdOptions.filter(({ isNotVisible }) => !isNotVisible);

        const lastWaybillRefillList = props.lastWaybill && props.lastWaybill[props.boundKey];
        const lastWaybillRefill = lastWaybillRefillList && lastWaybillRefillList.length && lastWaybillRefillList[lastWaybillRefillList.length - 1];

        // автозаполнение топливной картой, если она требуется
        if (typeIdOptions.length && filteredFuelCardIdOptions.length === 1) {
          if (newArr.length === 1) {
            const firstElement = newArr[0];
            if (!firstElement.fuel_card_id && firstElement.type_id === 1) {
              const refillTypeData = typeIdOptions.find(({ rowData }) => rowData.id === firstElement.type_id);
              if (refillTypeData && (isNullOrUndefined(fuelCardValue?.[0]) === isNullOrUndefined(previousfuelCardValue?.[0]))
              ) {
                newArr = [
                  {
                    ...firstElement,
                    fuel_card_id: filteredFuelCardIdOptions[0].value,
                  },
                ];
              }
            }
          }
        }

        // DITETS20A-25 Добавление возможности отключения способа заправки Налив для некоторых организаций
        if (!props.use_pouring) { /// gas учтен при передаче use_pouring параметра в компонент выше
          const refillTypeData = typeIdOptions.find(({ rowData }) => rowData.id === (isElectricalRefilBlock ? 2 : 1));
          const element = newArr?.[0];
          if (newArr.length > 0) {
            if (newArr.length === 1) {
              if (refillTypeData && (isNullOrUndefined(fuelCardValue?.[0]) === isNullOrUndefined(previousfuelCardValue?.[0]))) {
                newArr = [
                  {
                    ...element,
                    type_id: refillTypeData.value,
                    fuel_card_id: filteredFuelCardIdOptions.length === 1
                      ? filteredFuelCardIdOptions[0].value
                      : element.fuel_card_id,
                  },
                ];
                props.handleChange(newArr);
              }
            } else {
              for (const i in newArr) {
                if (refillTypeData && (isNullOrUndefined(fuelCardValue?.[i]) === isNullOrUndefined(previousfuelCardValue?.[i]))) {
                  newArr[i].type_id = refillTypeData.value;
                  newArr[i].fuel_card_id = filteredFuelCardIdOptions.length === 1
                    ? filteredFuelCardIdOptions[0].value
                    : newArr[i].fuel_card_id;
                }
              }
            }
          }
        }

        const cellKeyList = isObject(cellKey)
          ? Object.keys(cellKey)
          : [cellKey];

        if ( cellKeyList.includes('fuel_card_id') && typeof cellKey['fuel_card_id'] === 'number' && newArr[rowIndex]) {
          newArr[rowIndex].type_id = 1;
        }

        if ( cellKeyList.includes('type_id') && cellValue === 2 && newArr[rowIndex]) {
          newArr[rowIndex].fuel_card_id = null;
          newArr[rowIndex].number = null;
        }

        // при добавлении первой записи в заправки, подтяшиваем заправки из посл. закрытого ПЛ
        if (
          cellKeyList.includes('type_id')
          && cellValue === 1
          && newArr[rowIndex]
          && lastWaybillRefill
          && rowIndex === 0
          && fuelCardIdOptions.some(({ rowData }) => rowData.id === lastWaybillRefill.fuel_card_id)
        ) {
          newArr[rowIndex].fuel_card_id = lastWaybillRefill.fuel_card_id;
          newArr[rowIndex].type_id = 1;
          newArr[rowIndex].number = lastWaybillRefill.number;
        }

        // во вторую и последующие строки подтягиваем топливную карту, указанную в первой строке текущего ПЛ
        if (
          cellKeyList.includes('type_id')
          && cellValue === 1
          && newArr[rowIndex]
          && newArr.length > 1
        ) {
          newArr[rowIndex].fuel_card_id = newArr[0].fuel_card_id;
          newArr[rowIndex].type_id = 1;
          newArr[rowIndex].number = newArr[0].number;
        }
        props.handleChange(newArr);
      },
      [
        props.handleChange,
        typeIdOptions,
        fuelCardIdOptions,
        fuelCardValue,
        props.use_pouring,
        previousfuelCardValue,
        isElectricalRefilBlock,
        props.lastWaybill,
      ],
    );

    React.useEffect(() => {
      if (
        props.array.length
        && validPeriod.date_start
        && validPeriod.date_end
        && (props.waybill_status !== 'closed' || props.closed_editable)
      ) {
        const isDiffDates = diffDates(validPeriod.date_start, validPeriod.date_end) !== 0;
        const newArr = props.array.map((el) => {
          const isDateInPeriod = dateInPeriod(createValidDate(validPeriod.date_start), createValidDate(validPeriod.date_end), createValidDate(el.date), {
            excludeEnd: false,
            excludeStart: false,
          });
          if (!el.date && !isDiffDates) {
            if (!needUpdateRefillDate) {
              setNeedUpdateRefillDate(true);
            }
            return { ...el, date: validPeriod.date_start };
          }
          if (el.date && !isDateInPeriod) {
            if (!needUpdateRefillDate) {
              setNeedUpdateRefillDate(true);
            }
            return { ...el, date: null };
          }
          return el;
        });
        if (needUpdateRefillDate) {
          props.handleChange(newArr);
          setNeedUpdateRefillDate(false);
        }
      }
    }, [validPeriod.date_start, validPeriod.date_end, props.array, props.handleChange, needUpdateRefillDate]);

    const previousFuelType = usePrevious(props.fuel_type);
    React.useEffect(
      () => {
        if (props.fuel_type && props.fuel_type !== previousFuelType) {
          const availableFuelCars = fuelCardIdOptions.reduce<Set<number>>(
            (newSet, { rowData }) => {
              newSet.add(rowData.id);

              return newSet;
            },
            new Set(),
          );
          const currentArrayIndex = keyBy(props.arrayOrigin, 'fuel_card_id');

          handleChange(
            props.array.map(
              (rowData) => ({
                ...rowData,
                fuel_card_id: availableFuelCars.has(rowData.fuel_card_id)
                  ? rowData.fuel_card_id
                  : (
                    currentArrayIndex[rowData.fuel_card_id]
                      ? currentArrayIndex[rowData.fuel_card_id].fuel_card_id
                      : null
                  ),
              }),
            ),
          );
        }
      },
      [
        fuelCardIdOptions,
        previousFuelType,
        props.fuel_type,
        props.array,
        handleChange,
        props.arrayOrigin,
        notFiltredFuelCardsIndex,
      ],
    );

    // Можно наверное уйти к одному флагу
    const showForEquipmentCarRefil = !props.is_one_fuel_tank
      && (props.array.length
          || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill))); // если массив пустой и мы можем добавить строку
    const showForCarRefil = props.array.length
      || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill)); // если массив пустой и мы можем добавить строку
    const showForGasRefil = props.array.length
      || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill)); // если массив пустой и мы можем добавить строку
    const showForElectricalRefil = props.array.length
      || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill)); // если массив пустой и мы можем добавить строку
    
    // Можно наверное уйти к одному флагу
    const showBlock = isEquipmentRefilBlock
      ? showForEquipmentCarRefil
      : isCarRefilBlock
        ? showForCarRefil
        : isGasRefilBlock
          ? showForGasRefil
          : isElectricalRefilBlock
            ? showForElectricalRefil
            : false;

    const defaultItem: FuelCardOnCars = { // для создания топливной карты
      ...defaultFuelCardOnCarsItem,
      gov_number: props.gov_number,
      car_id: props.car_id,
    };

    return showBlock && (
      <div>
        <HrLineWaybill />
        <TableInput
          id={props.id}
          array={props.array}
          errors={props.errors}
          meta={metaCarRefillRaw}
          onChange={handleChange}
          header={
            <CarRefillTableHeader
              id={props.id}
              title={props.title}
              selectedRowIndex={selectedRowIndex}
              array={props.array}
              meta={metaCarRefillRaw}
              onChange={handleChange}
              defaultHandleChange={props.defaultHandleChange}
              visibleButtons={!props.disabled}
              structure_id={props.structure_id}
              fuel_cards_creating={props.fuel_cards_creating}
              fuel_type={props.fuel_type}
              noHasFuelCardIdOptions={!fuelCardIdOptions?.length}
              fuel_card_on_cars = {[defaultItem]}
              handleUpdateFuelCard={handleUpdateFuelCard}
              page={props.page}
              is_refill={props.is_refill}
              is_refill_error={props.is_refill_error}
              buttonWidth={160}
              disabled={props.disabled}
              errors={props.errors}
            />
          }
          selectedRowIndex={selectedRowIndex}
          setSelectedRowIndex={setSelectedRowIndex}

          disabled={props.disabled}
        />
        <DisplayFlexAlignCenterFooterForm>
          {
            Boolean(props.array && props.array[0]) && (
              <FooterEnd margin={30}>
                <div><b>{'Итого '}</b></div>
                <div><b>{props.fuel_given.toFixed(3).replace('.', ',')}</b></div>
              </FooterEnd>
            )
          }
        </DisplayFlexAlignCenterFooterForm>
      </div>
    );
  },
);

export default FieldWaybillCarRefill;
