import * as React from 'react';
import { get, uniqBy } from 'lodash';

import { IDataTableSchema } from 'components/old/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/old/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/old/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/old/ui/table/DataTable';
import { employeeFIOLabelFunction } from 'utils/labelFunctions';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function getTableMeta(props: any = {}): IDataTableSchema {
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
          options: uniqBy(
            props.employeesList.map(({ id }) => ({
              value: id,
              label: employeeFIOLabelFunction(props.employeeIndex, id),
            })),
            'value',
          ),
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

const Table: React.FC<any> = (props) => (
  <DataTable
    multiSelection={true}
    results={props.data}
    renderers={renderers}
    tableMeta={getTableMeta(props)}
    onRowSelected={props.onRowSelected}
    onRowChecked={props.onRowChecked}
    onAllRowsChecked={props.onAllRowsChecked}
    selected={props.selected}
    checked={props.checked}
    selectField="frontId"
    initialSort="frontId"
    />
);

export default Table;
