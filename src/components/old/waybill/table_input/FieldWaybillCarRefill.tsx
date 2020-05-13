import * as React from 'react';
import { get, keyBy } from 'lodash';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

import TableInput, { TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { DisplayFlexAlignCenterFooterForm, FooterEnd } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import CarRefillTableHeader from './CarRefillTableHeader';
import { fuelCardsGetAndSetInStore, equipmentFuelCardsGetAndSetInStore } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { makeFuelCardIdOptions } from './utils';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { HrLineWaybill } from 'components/new/pages/login/styled/styled';
import { createValidDate } from 'components/@next/@utils/dates/dates';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { isObject } from 'util';
import { actionGetLastClosedWaybill } from 'redux-main/reducers/modules/waybill/waybill_actions';

type Props = {
  id: string;
  errors: Array<any>;
  title: string;
  handleChange: (refill: Waybill['car_refill']) => any;

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
  is_one_fuel_tank?: boolean;
  boundKey: string;
  fuelCardsList: IStateAutobase['fuelCardsList'] | IStateAutobase['equipmentFuelCardsList'];

  canEditIfClose: boolean;
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
  }
);

const metaTypeId: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'type_id',
  title: 'Способ заправки',
  format: 'select',
  width: 200,
  options: [],
  uniqValueInCol: true,
};

const metaFuelCardId: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'fuel_card_id',
  title: 'Топливная карта',
  placeholder: '',
  format: 'select',
  disabledIf: [
    {
      type: 'compare_with_value_in_option',
      path_to_option: 'type_id',
      compareItemPath: 'is_fuel_card_required',
      match: false,
    },
  ],
  resetIf: [
    {
      type: 'compare_with_value_in_option',
      path_to_option: 'type_id',
      compareItemPath: 'is_fuel_card_required',
      match: false,
    },
  ],
  onChange: (onChange) => (value, option) => {
    onChange({
      fuel_card_id: value,
      number: get(option, 'label') || null,
    });
  },
  width: 200,
  options: [],
};

const metaValue: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'value',
  title: 'Выдано, л',
  width: 100,
  format: 'toFixed3',
};

const FieldWaybillCarRefill: React.FC<Props> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);
    const notFiltredFuelCardsIndex = etsUseSelector((state) => getAutobaseState(state).notFiltredFuelCardsIndex);
    const dispatch = etsUseDispatch();
    const isEquipmentRefilBlock = props.boundKey === 'equipment_refill';
    const isCarRefilBlock = props.boundKey === 'car_refill';

    const isPermittedWaybillRefill = etsUseSelector((state) => getSessionState(state).userData.permissionsSet.has(waybillPermissions.refill));
    const fuelCardsList = etsUseSelector((state) => isCarRefilBlock
      ? getAutobaseState(state).fuelCardsList
      : getAutobaseState(state).equipmentFuelCardsList
    );
    const refillTypeList = etsUseSelector((state) => getSomeUniqState(state).refillTypeList);
    const [lastClosedWaybill, setLastClosedWaybill] = React.useState(null);

    React.useEffect(() => {
      getLastClosedWaybill();
    }, []);

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
          rowData,
        }));
      },
      [refillTypeList],
    );

    const metaCarRefillRaw = React.useMemo(
      () => {
        const meta: Array<TableMeta<ValuesOf<Waybill['car_refill']>>> = [
          {
            ...metaTypeId,
            options: typeIdOptions,
          },
          {
            ...metaFuelCardId,
            options: fuelCardIdOptions,
          },
          {
            ...metaValue,
            disabled: !props.array[selectedRowIndex]?.type_id || (props.array[selectedRowIndex]?.type_id === 1 && !props.array[selectedRowIndex]?.fuel_card_id),
          }
        ];

        return meta;
      },
      [fuelCardIdOptions, typeIdOptions, props.array, selectedRowIndex],
    );
    const fact_departure_date = createValidDate(get(props, 'date_for_valid.fact_departure_date'));
    const fact_arrival_date = createValidDate(get(props, 'date_for_valid.fact_arrival_date'));

    const plan_departure_date = createValidDate(get(props, 'date_for_valid.plan_departure_date'));
    const plan_arrival_date = createValidDate(get(props, 'date_for_valid.plan_arrival_date'));

    const handleUpdateFuelCard = React.useCallback(
      async () => {
        const payload: any = {};

        if (props.car_id) {
          payload.car_id = props.car_id;
        }
        if (props.fuel_type) {
          payload.fuel_type = props.fuel_type;
        }

        const validPeriod = fact_departure_date && fact_arrival_date
          ? {
            date_start: fact_departure_date,
            date_end: fact_arrival_date,
          }
          : {
            date_start: plan_departure_date,
            date_end: plan_arrival_date,
          };
        payload.date_start = validPeriod.date_start;
        payload.date_end = validPeriod.date_end;
        payload.is_archive = false;

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
      ],
    );

    React.useEffect(
      () => {
        handleUpdateFuelCard();
      }, [
        handleUpdateFuelCard,
      ],
    );

    const getLastClosedWaybill = React.useCallback(
      async () => {
        return await dispatch(actionGetLastClosedWaybill({
          car_id: props.car_id
        }, {
          page: props.page,
          path: props.path,
        })).then((res) => {
          setLastClosedWaybill(res);
        });
      }, [props.car_id]);

    const handleChange = React.useCallback(
      async (array: Props['array'], rowIndex?: number, cellValue?: number, cellKey?: string): void => {
        let newArr = array;
        const filteredFuelCardIdOptions = fuelCardIdOptions.filter(({ isNotVisible }) => !isNotVisible);

        const lastWaybillRefillList = lastClosedWaybill && lastClosedWaybill[props.boundKey];
        const lastWaybillRefill = lastWaybillRefillList && lastWaybillRefillList.length && lastWaybillRefillList[lastWaybillRefillList.length - 1];

        // автозаполнение топливной картой, если она требуется
        if (typeIdOptions.length && filteredFuelCardIdOptions.length === 1) {
          if (newArr.length === 1) {
            const firstElement = newArr[0];
            if (!firstElement.fuel_card_id) {
              const refillTypeData = typeIdOptions.find(({ rowData }) => rowData.id === firstElement.type_id);
              if (refillTypeData && refillTypeData.rowData.is_fuel_card_required) {
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
      ],
    );

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

    const showForEquipmentCarRefil = !props.is_one_fuel_tank
      && (props.array.length
          || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill))); // если массив пустой и мы можем добавить строку
    const showForCarRefil = props.array.length
      || (!props.array.length && !(props.disabled && !isPermittedWaybillRefill)); // если массив пустой и мы можем добавить строку

    const showBlock = isEquipmentRefilBlock
      ? showForEquipmentCarRefil
      : isCarRefilBlock
        ? showForCarRefil
        : false;

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
              visibleButtons={!props.disabled}
              structure_id={props.structure_id}
              fuel_type={props.fuel_type}
              noHasFuelCardIdOptions={!fuelCardIdOptions.length}

              handleUpdateFuelCard={handleUpdateFuelCard}
              page={props.page}

              buttonWidth={160}
              disabled={props.disabled}
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
