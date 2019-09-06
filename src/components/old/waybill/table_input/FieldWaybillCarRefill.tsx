import * as React from 'react';
import { connect, HandleThunkActionCreator } from 'react-redux';

import TableInput, { TableInputProps, TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { ReduxState } from 'redux-main/@types/state';
import { DisplayFlexAlignCenterFooterForm, FooterEnd } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import CarRefillTableHeader from './CarRefillTableHeader';
import { fuelCardsGetAndSetInStore } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { InitialStateSession } from 'redux-main/reducers/modules/session/@types/session';
import { makeFuelCardIdOptions, makeFuelCardStrickOptions } from './utils';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';

type FieldWaybillCarRefillStateProps = {
  fuelCardsList: IStateAutobase['fuelCardsList'];
  refillTypeList: IStateSomeUniq['refillTypeList'],
  userCompanyId: InitialStateSession['userData']['company_id'];
  userStructureId: InitialStateSession['userData']['structure_id'];
};
type FieldWaybillCarRefillDispatchProps = {
  fuelCardsGetAndSetInStore: HandleThunkActionCreator<typeof fuelCardsGetAndSetInStore>;
};
type FieldWaybillCarRefillOwnProps = {
  errors: any[];
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
type FieldWaybillCarRefillMergedProps = (
  FieldWaybillCarRefillStateProps
  & FieldWaybillCarRefillDispatchProps
  & FieldWaybillCarRefillOwnProps
);

type FieldWaybillCarRefillProps = FieldWaybillCarRefillMergedProps;

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
  width: 200,
  options: [],
};

const metaValue: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'value',
  title: 'Выдано, л',
  width: 100,
  format: 'number',
};

const FieldWaybillCarRefill: React.FC<FieldWaybillCarRefillProps> = React.memo(
  (props) => {
    const [selectedRowIndex, setSelectedRowIndex] = React.useState(null);

    const fuelCardIdOptions = React.useMemo(
      () => {
        return makeFuelCardIdOptions(
          props.fuelCardsList,
          props.array,
          props.fuel_type,
          props.userCompanyId,
          props.structure_id,
        );
      },
      [
        props.fuelCardsList,
        props.structure_id,
        props.userCompanyId,
        props.array,
        props.fuel_type,
      ],
    );

    const typeIdOptions = React.useMemo(
      () => {
        return props.refillTypeList.map((rowData) => ({
          value: rowData.id,
          label: rowData.name,
          isNotVisible: !rowData.is_selectable,
          rowData,
        }));
      },
      [props.refillTypeList],
    );

    const metaCarRefillRaw = React.useMemo(
      () => {
        const meta: TableMeta<ValuesOf<Waybill['car_refill']>>[] = [
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
        props.fuelCardsGetAndSetInStore(
          {},
          {
            page: props.page,
            path: props.path,
          },
        );
      },
      [],
    );

    const previosFuelType = usePrevious(props.fuel_type);
    React.useEffect(
      () => {
        if (props.fuel_type && props.fuel_type !== previosFuelType) {
          const availabelFuelCars = (makeFuelCardStrickOptions(
            props.fuelCardsList,
            props.fuel_type,
            props.userCompanyId,
            props.userStructureId,
          ) as DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>[]).reduce(
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
      [previosFuelType, props.fuel_type, props.fuelCardsList, props.userCompanyId, props.userStructureId, props.array, props.handleChange, props.structure_id],
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

export default connect<FieldWaybillCarRefillStateProps, FieldWaybillCarRefillDispatchProps, FieldWaybillCarRefillOwnProps, ReduxState>(
  (state) => ({
    fuelCardsList: getAutobaseState(state).fuelCardsList,
    refillTypeList: getSomeUniqState(state).refillTypeList,
    userCompanyId: getSessionState(state).userData.company_id,
    userStructureId: getSessionState(state).userData.structure_id,
  }),
  (dispatch: any) => ({
    fuelCardsGetAndSetInStore: (...arg) => (
      dispatch(
        fuelCardsGetAndSetInStore(...arg),
      )
    ),
  }),
)(FieldWaybillCarRefill);
