import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { actionLoadOrderList } from 'redux-main/reducers/modules/order/action-order';
import { makeOptionsOrderNumberForMissionList, makeFilteredTOList } from './makeOptions';
import { Order } from 'redux-main/reducers/modules/order/@types';
import EtsBootstrap from 'components/new/ui/@bootstrap';
import DataTable from 'components/old/ui/table/DataTable';
import { FlexContainer } from 'global-styled/global-styled';
import ErrorsBlock from 'components/@next/@ui/renderFields/ErrorsBlock/ErrorsBlock';
import { FieldLabel } from 'components/@next/@ui/renderFields/styled';
import ModalBodyPreloader from 'components/old/ui/new/preloader/modal-body/ModalBodyPreloader';
import missionActions from 'redux-main/reducers/modules/missions/mission/actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

const Table: any = DataTable;

type Props = {
  disabled: boolean;
  path?: string;
  page?: string;
  value: number;
  error: string;
  onChange: (obj: Partial<Mission>) => void;
  date_start: string;
  date_end: string;
  formDataKey: FormKeys & 'mission';
};

export const tableMeta = {
  cols: [
    {
      name: 'tk_operation_name',
      displayName: 'Операция',
      type: 'string',
      filter: false,
    },
    {
      name: 'object_type_name',
      displayName: 'Тип объекта',
      type: 'string',
      filter: false,
    },
    {
      name: 'elem',
      displayName: 'Элемент',
      type: 'string',
      filter: false,
    },
    {
      name: 'num_exec',
      displayName: 'Количество выполнений',
      type: 'number',
      filter: false,
    },
    {
      name: 'date_from',
      displayName: 'Начало действий',
      type: 'advanced-datetime',
      filter: false,
    },
    {
      name: 'date_to',
      displayName: 'Окончание действий',
      type: 'advanced-datetime',
      filter: false,
    },
    {
      name: 'work_type_name',
      displayName: 'Способ выполнения операции',
      type: 'string',
      filter: false,
    },
  ],
};

const FieldOrder: React.FC<Props> = React.memo(
  (props) => {
    const page = useForm.useFormDataMeta(props.formDataKey);
    const technical_operations = useForm.useFormDataFormStatePickValue<Order, Order['technical_operations']>(props.formDataKey, 'technical_operations');
    const order_id = useForm.useFormDataFormStatePickValue<Mission, Mission['order_id']>(props.formDataKey, 'order_id');
    const order_operation_id = useForm.useFormDataFormStatePickValue<Mission, Mission['order_operation_id']>(props.formDataKey, 'order_operation_id');
    const technicalOperationRegistryForMissionList = etsUseSelector((state) => getSomeUniqState(state).technicalOperationRegistryForMissionList);
    const [filteredTO, setFilteredTO] = React.useState([]);
    const [orderOptions, setOrderOptions] = React.useState([]);
    const [showForm, setShowForm] = React.useState(false);
    const [selectedElement, setSelectedElement] = React.useState(null);
    const [orderRaw, setOrderRaw] = React.useState([]);
    const dispatch = etsUseDispatch();
    const error = !order_id || !selectedElement ? 'Необходимо выбрать поручение' : '';

    React.useEffect(() => {
      (async () => {
        const result = await dispatch(actionLoadOrderList({}, page));
        setOrderOptions(makeOptionsOrderNumberForMissionList(
          result.data,
          props.date_start,
          props.date_end
        ));
        setOrderRaw(result.data);
      })();
    }, []);

    React.useEffect(() => {
      if (technical_operations) {
        setFilteredTO(makeFilteredTOList(technical_operations, technicalOperationRegistryForMissionList));
      }
    }, [technical_operations]);

    const selectedOrderRow = React.useMemo(
      (): Order => {
        if (order_id) {
          return orderRaw.find((rowData) => rowData.id === order_id);
        }
        return null;
      },
      [orderRaw, order_id],
    );
    const selectedOrderTORowBYParams = React.useMemo(
      (): ValuesOf<Order['technical_operations']> => {
        return (get(selectedOrderRow, 'technical_operations') || []).find((toData) => toData.order_operation_id === order_operation_id);
      },
      [selectedOrderRow, order_operation_id],
    );

    const handleClick = React.useCallback(
      () => {
        setShowForm(true);
      }, []);

    const handleSelectedElementChange = React.useCallback((selectedRow) => {
      const selectedRowElement = get(selectedRow, 'props.data', null);
      setSelectedElement(selectedRowElement);
    }, [selectedElement]);

    const onSelect = React.useCallback(() => {
      const changeObj = {
        faxogramm_id: get(selectedOrderRow, 'id'),
        order_id: get(selectedOrderRow, 'id'),
        norm_id: get(selectedElement, 'norm_id'),
        norm_ids: [get(selectedElement, 'norm_id')],
        date_start: get(selectedElement, 'date_from') || get(selectedOrderRow, 'order_date'),
        date_end: get(selectedElement, 'date_to') || get(selectedOrderRow, 'order_date_to'),
        technical_operation_id: get(selectedElement, 'id'),
        technical_operation_name: get(selectedElement, 'tk_operation_name'),
        municipal_facility_id: get(selectedElement, 'municipal_facility_id'),
        municipal_facility_name: get(selectedElement, 'elem'),
        order_operation_id: get(selectedElement, 'order_operation_id'),
        order_number: get(selectedOrderRow, 'order_number'),
        order_status: get(selectedOrderRow, 'status'),
      };
      props.onChange({
        ...changeObj,
      });
      setShowForm(false);
    }, [props.onChange, showForm, selectedElement, selectedOrderRow]);

    const handleChangeWrap = React.useCallback(
      (valueNew, option) => {
        if (valueNew !== props.value) {
          const changeObj = {
            order_id: valueNew,
            order_name: option.label?.split(' ')[0] ?? '',
            technical_operations: get(option.rowData, 'technical_operations', []),
            technical_operation_id: null,
          };

          props.onChange({
            ...changeObj,
          });
        }
      },
      [props.onChange, props.value],
    );

    React.useEffect(
      () => {
        dispatch(
          missionActions.actionSetDependenceOrderDataForMission(
            selectedOrderRow,
            selectedOrderTORowBYParams,
          ),
        );
      },
      [selectedOrderRow, selectedOrderTORowBYParams],
    );

    const onHide = React.useCallback(() => {
      setShowForm(false);
    }, [showForm]);

    return (
      <>
        <EtsBootstrap.Col md={4}>
          <ExtField
            type="select"
            id="order_id"
            label="Номер централизованного задания"
            clearable={false}
            disabled={props.disabled}
            options={orderOptions}
            placeholder="Не выбрано"
            emptyValue={null}
            value={props.value}
            error={props.error}
            onChange={handleChangeWrap}
          />
        </EtsBootstrap.Col>
        <EtsBootstrap.Col md={2}>
          <FlexContainer direction="column" alignItems="start">
            <FieldLabel>Поручение</FieldLabel>
            <EtsBootstrap.Button disabled={props.disabled} onClick={handleClick}>
              Выбрать
            </EtsBootstrap.Button>
            <ErrorsBlock error={error} />
          </FlexContainer>
          {showForm && (
            <EtsBootstrap.ModalContainer
              id="modal-technical-operations"
              show
              onHide={onHide}
              bsSize="large"
            >
              <EtsBootstrap.ModalHeader closeButton>
                <EtsBootstrap.ModalTitle>
                  Доступные поручения
                </EtsBootstrap.ModalTitle>
              </EtsBootstrap.ModalHeader>

              <ModalBodyPreloader path={props.path} page={props.page} typePreloader="mainpage">
                <Table
                  noTitle={true}
                  noFilter
                  selectField={'order_operation_id'}
                  results={filteredTO}
                  enumerated
                  tableMeta={tableMeta}
                  className="technical-operations-table"
                  onRowSelected={handleSelectedElementChange}
                  selected={selectedElement}
                />
              </ModalBodyPreloader>
              <EtsBootstrap.ModalFooter>
                <EtsBootstrap.Button onClick={onSelect}>
                  Выбрать
                </EtsBootstrap.Button>
              </EtsBootstrap.ModalFooter>
            </EtsBootstrap.ModalContainer>
          )}
        </EtsBootstrap.Col>
      </>
    );
  },
);

export default FieldOrder;
