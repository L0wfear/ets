import * as React from 'react';
import TableInput, { TableInputProps, TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { connect } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { DisplayFlexAlignCenterFooterForm } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState } from 'redux-main/reducers/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';

type FieldWaybillCarRefillStateProps = {
  fuelCardsList: IStateAutobase['fuelCardsList'];
  refillTypeList: IStateSomeUniq['refillTypeList'],
};
type FieldWaybillCarRefillDispatchProps = {
};
type FieldWaybillCarRefillOwnProps = {
  array: Waybill['car_refill'] | Waybill['equipment_refill'];
  errors: any[];
  handleChange: TableInputProps['onChange'];

  IS_DRAFT_OR_ACTIVE: boolean;
  fuel_given: Waybill['fuel_given'] | Waybill['equipment_fuel_given'];

  disabled?: boolean;
  page: string;
  path?: string;
};
type FieldWaybillCarRefillMergedProps = (
  FieldWaybillCarRefillStateProps
  & FieldWaybillCarRefillDispatchProps
  & FieldWaybillCarRefillOwnProps
);

type FieldWaybillCarRefillProps = FieldWaybillCarRefillMergedProps;

const metaTypeId: TableMeta<ValuesOf<Waybill['car_refill'] | Waybill['equipment_refill']>> = {
  key: 'type_id',
  title: 'Способо заправки',
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
    const fuelCardIdOptions = React.useMemo(
      () => {
        return props.fuelCardsList.map((rowData) => ({
          value: rowData.id,
          label: rowData.number,
          rowData,
        }));
      },
      [props.fuelCardsList],
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

    return (
      <div>
        <TableInput
          array={props.array}
          errors={props.errors}
          meta={metaCarRefillRaw}
          onChange={props.handleChange}

          addName="Добавить заправку"
          visibleAdd={props.IS_DRAFT_OR_ACTIVE}

          removeName="Удалить заправку"
          visibleRemove={props.IS_DRAFT_OR_ACTIVE}

          disabled={props.disabled}
        />
        <DisplayFlexAlignCenterFooterForm>
          {
            props.fuel_given > 0 && (
              <span>{`Итого ${props.fuel_given.toFixed(3)}`}</span>
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
  }),
)(FieldWaybillCarRefill);
