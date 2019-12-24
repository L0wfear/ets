import * as React from 'react';
import TableInput, { TableInputProps, TableMeta } from 'components/new/ui/table_input/TableInput';
import { Waybill } from 'redux-main/reducers/modules/waybill/@types';
import { connect, HandleThunkActionCreator } from 'react-redux';
import { ReduxState } from 'redux-main/@types/state';
import { DisplayFlexAlignCenterFooterForm, DivNone, FooterEnd } from 'global-styled/global-styled';
import { getSomeUniqState, getAutobaseState, getSessionState } from 'redux-main/reducers/selectors';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateAutobase } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import CarRefillTableHeader from './CarRefillTableHeader';
import { fuelCardsGetAndSetInStore } from 'redux-main/reducers/modules/autobase/fuel_cards/actions-fuelcards';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { makeFuelCardIdOptions } from './utils';
import usePrevious from 'components/new/utils/hooks/usePrevious';
import { FuelCard } from 'redux-main/reducers/modules/autobase/fuel_cards/@types/fuelcards.h';
import { DefaultSelectOption } from 'components/old/ui/input/ReactSelect/utils';
import waybillPermissions from 'components/new/pages/waybill/_config-data/permissions';
import { actionLoadTimeMoscow } from 'redux-main/reducers/modules/some_uniq/time_moscow/actions';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { get } from 'lodash';
import * as moment from 'moment';
import { createValidDateTime } from 'components/@next/@utils/dates/dates';

type FieldWaybillCarRefillStateProps = {
  isPermittedWaybillRefill: boolean;
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
  car_id: Waybill['car_id'];
  date_for_valid: {
    fact_departure_date: Waybill['fact_departure_date'],
    plan_departure_date: Waybill['plan_departure_date'],
  };
  is_one_fuel_tank?: boolean;
  boundKey: string;

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
    const dispatch = etsUseDispatch();

    const fuelCardIdOptions = React.useMemo(
      () => {
        return makeFuelCardIdOptions(
          props.fuelCardsList,
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
    const fact_departure_date = createValidDateTime(get(props, 'date_for_valid.fact_departure_date'));
    const plan_departure_date = createValidDateTime(get(props, 'date_for_valid.plan_departure_date'));

    const updateFuelCardList = React.useCallback(
      async () => {
        const payload: any = {};

        if (props.car_id) {
          payload.car_id = props.car_id;
        }
        if (props.fuel_type) {
          payload.fuel_type = props.fuel_type;
        }

        const time = await dispatch(
          actionLoadTimeMoscow(
          {},
          {
            page: props.page,
            path: props.path,
          },
        ));

        const timeFromWaybill = fact_departure_date
          ? fact_departure_date
          : plan_departure_date;

        const valid_at = moment(time.date).diff(moment(timeFromWaybill), 'minutes') <= 0
          ? timeFromWaybill
          : time.date;

        payload.valid_at = valid_at;

        props.fuelCardsGetAndSetInStore(
          {
            ...payload,
          },
          {
            page: props.page,
            path: props.path,
          },
        );
      },
      [
        props.car_id,
        props.fuel_type,
        props.date_for_valid.fact_departure_date,
        props.date_for_valid.plan_departure_date,
        props.page,
        props.path,
      ],
    );

    React.useEffect(() => {
      updateFuelCardList();
      // console.log('updateFuelCardList === ');
    }, [
      props.car_id,
      props.fuel_type,
      fact_departure_date,
      plan_departure_date,
    ]);

    const handleUpdateFuelCard = React.useCallback(
      async () => {
        updateFuelCardList();
      },
      [
        props.car_id,
        props.fuel_type,
        props.page,
        props.path,
      ],
    );

    const previosFuelType = usePrevious(props.fuel_type);
    React.useEffect(
      () => {
        if (props.fuel_type && props.fuel_type !== previosFuelType) {
          const availabelFuelCars = (
            makeFuelCardIdOptions(
              props.fuelCardsList,
            ) as DefaultSelectOption<FuelCard['id'], FuelCard['number'], FuelCard>[])
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
      [previosFuelType, props.fuel_type, props.fuelCardsList, props.userCompanyId, props.userStructureId, props.array, props.handleChange, props.structure_id],
    );

    const showForEquipmentCarRefil = !props.is_one_fuel_tank
      && (props.array.length
          || (!props.array.length && !(props.disabled && !props.isPermittedWaybillRefill))); // если массив пустой и мы можем добавить строку
    const showForCarRefil = props.array.length
      || (!props.array.length && !(props.disabled && !props.isPermittedWaybillRefill)); // если массив пустой и мы можем добавить строку

    const showBlock = props.boundKey === 'equipment_refill'
      ? showForEquipmentCarRefil
      : props.boundKey === 'car_refill'
        ? showForCarRefil
        : false;

    return showBlock && (
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
            Boolean(props.array) && Boolean(props.array.length)
              ? (
                <FooterEnd margin={30}>
                  <div><b>{'Итого '}</b></div>
                  <div><b>{props.fuel_given.toFixed(3)}</b></div>
                </FooterEnd>
              )
              : (
                <DivNone />
              )
          }
        </DisplayFlexAlignCenterFooterForm>
      </div>
    );
  },
);

export default connect<FieldWaybillCarRefillStateProps, FieldWaybillCarRefillDispatchProps, FieldWaybillCarRefillOwnProps, ReduxState>(
  (state) => ({
    isPermittedWaybillRefill: getSessionState(state).userData.permissionsSet.has(waybillPermissions.refill),
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
