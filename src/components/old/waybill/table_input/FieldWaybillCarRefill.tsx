import * as React from 'react';
import { get } from 'lodash';

import TableInput, { TableInputProps, TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { DisplayFlexAlignCenterFooterForm, FooterEnd } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import CarRefillTableHeader from './CarRefillTableHeader';
import { fuelCardsGetAndSetInStore } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { makeFuelCardIdOptions, makeFuelCardStrickOptions } from './utils';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';

type Props = {
  id: string;
  errors: Array<any>;
  title: string;
  handleChange: TableInputProps['onChange'];

  IS_DRAFT_OR_ACTIVE: boolean;

  disabled?: boolean;
  page: string;
  path?: string;
  structure_id: Waybill['structure_id'];
  fuel_type: Waybill['fuel_type'];

  canEditIfClose: boolean;
} & (
  {
    array: Waybill['car_refill'];
    fuel_given: Waybill['fuel_given'];
    fuel_type: Waybill['fuel_type'];
  } | {
    array: Waybill['equipment_refill'];
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
  format: 'number',
};

const FieldWaybillCarRefill: React.FC<Props> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);

    const fuelCardsList = etsUseSelector((state) => getAutobaseState(state).fuelCardsList);
    const refillTypeList = etsUseSelector((state) => getSomeUniqState(state).refillTypeList);
    const userCompanyId = etsUseSelector((state) => getSessionState(state).userData.company_id);
    const userStructureId = etsUseSelector((state) => getSessionState(state).userData.structure_id);
    const dispatch = etsUseDispatch();

    const fuelCardIdOptions = React.useMemo(
      () => {
        return makeFuelCardIdOptions(
          fuelCardsList,
          props.array,
          props.fuel_type,
          userCompanyId,
          props.structure_id,
        );
      },
      [
        fuelCardsList,
        props.structure_id,
        userCompanyId,
        props.array,
        props.fuel_type,
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
          metaValue,
        ];

        return meta;
      },
      [fuelCardIdOptions, typeIdOptions, props.array],
    );

    const handleUpdateFuelCard = React.useCallback(
      () => {
        dispatch(
          fuelCardsGetAndSetInStore({}, props),
        );
      },
      [],
    );

    const previosFuelType = usePrevious(props.fuel_type);
    React.useEffect(
      () => {
        if (props.fuel_type && props.fuel_type !== previosFuelType) {
          const availabelFuelCars = (
            makeFuelCardStrickOptions(
              fuelCardsList,
              props.fuel_type,
              userCompanyId,
              userStructureId,
            ) as Array<DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>>)
            .reduce(
              (newSet, { rowData }) => {
                newSet.add(rowData.id);

                return newSet;
              },
              new Set(),
            );

          props.handleChange(
            props.array.map(
              (rowData) => ({
                ...rowData,
                fuel_card_id: availabelFuelCars.has(rowData.fuel_card_id) ? rowData.fuel_card_id : null,
              }),
            ),
          );
        }
      },
      [previosFuelType, props.fuel_type, fuelCardsList, userCompanyId, userStructureId, props.array, props.handleChange, props.structure_id],
    );

    return (
      <div>
        <TableInput
          array={props.array}
          errors={props.errors}
          meta={metaCarRefillRaw}
          onChange={props.handleChange}

          header={
            <CarRefillTableHeader
              id={props.id}
              title={props.title}
              selectedRowIndex={selectedRowIndex}
              array={props.array}
              meta={metaCarRefillRaw}
              onChange={props.handleChange}
              visibleButtons={props.IS_DRAFT_OR_ACTIVE || props.canEditIfClose}
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
                <div><b>{props.fuel_given.toFixed(3)}</b></div>
              </FooterEnd>
            )
          }
        </DisplayFlexAlignCenterFooterForm>
      </div>
    );
  },
);

export default FieldWaybillCarRefill;
