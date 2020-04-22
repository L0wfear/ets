import * as React from 'react';
import { get, uniqBy } from 'lodash';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { employeeEmployeeGetSetEmployee } from 'redux-main/reducers/modules/employee/employee/actions';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function getTableMeta(props: any = {}, employeesOptions: Array<any>): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'date_from',
        displayName: 'Начало действия',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'number',
        cssClassName: 'width60',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'route_name',
        displayName: 'Маршрут',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'technical_operation_name',
        displayName: 'Технологическая операция',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'municipal_facility_name',
        displayName: 'Элемент',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'passes_count',
        displayName: 'Количество выполнений',
        type: 'number',
        filter: {
          type: 'multiselect',
        },
        cssClassName: 'width120',
      },
      {
        name: 'foreman_fio',
        displayName: 'Бригадир',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'brigade_employee_id_list_id',
        displayName: 'Бригада',
        type: 'string',
        filter: {
          type: 'multiselect',
          someInRowValue: true,
          options: employeesOptions,
        },
      },
      {
        name: 'structure_id',
        displayName: 'Подразделение',
        cssClassName: 'width80',
        type: 'number',
        filter: {
          type: 'multiselect',
          byLabel: 'structure_name',
        },
        display: props.structures.length,
      },
      {
        name: 'comment',
        displayName: 'Комментарий',
        type: 'string',
        filter: false,
        cssClassName: 'width300',
      },
    ],
  };
  return meta;
}

const renderers: ISchemaRenderer = {
  date_from: ({ data }) => makeDateFormated(data, true),
  date_to: ({ data }) => makeDateFormated(data, true),
  structure_id: ({ rowData }) => <div>{get(rowData, 'structure_name') || '-'}</div>,
  brigade_employee_id_list_id: ({ data, rowData }) => (
    <div>
      {
        rowData.brigade_employee_id_list_fio.join(', ')
      }
    </div>
  ),
};

const Table: React.FC<any> = React.memo(
  (props) => {
    const [employeesOptions, setOptions] = React.useState([]);
    const dispatch = etsUseDispatch();
    React.useEffect(
      () => {
        const loadData = async () => {
          const { data, dataIndex } = await dispatch(employeeEmployeeGetSetEmployee({}, props));
          setOptions(
            uniqBy(
              data.map(({ id }) => ({
                value: id,
                label: employeeFIOLabelFunction(dataIndex, id),
              })),
              'value',
            ),
          );
        };

        loadData();
      },
      [props.order_id],
    );

    return (
      <DataTable
        multiSelection={true}
        results={props.data}
        renderers={renderers}
        tableMeta={getTableMeta(props, employeesOptions)}
        onRowSelected={props.onRowSelected}
        onRowChecked={props.onRowChecked}
        onAllRowsChecked={props.onAllRowsChecked}
        selected={props.selected}
        checked={props.checked}
        selectField="frontId"
        initialSort="frontId"
      />
    );
  },
);

export default Table;
