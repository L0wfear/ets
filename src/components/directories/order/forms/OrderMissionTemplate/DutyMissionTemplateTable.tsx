import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import { getTableMeta as getMissionTempalteTableMeta } from 'components/missions/duty_mission_template/DutyMissionTemplatesTable';
import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function getTableMeta(props: any = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'date_from',
        displayName: 'Начало действия поручения',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия поручения',
        type: 'datetime',
        filter: {
          type: 'datetime',
        },
      },
      ...getMissionTempalteTableMeta(props).cols.map(({ name, displayName, type, display: displayOuter, filter }: any) => ({
        name,
        displayName,
        type,
        filter,
        display: typeof displayOuter === 'boolean' ? displayOuter : true,
      })),
    ],
  };
  return meta;
}

const getRenders = (props) => {
  const renderers: ISchemaRenderer = {
    date_from: ({ data }) => (<DateFormatter date={data} time={true} />),
    date_to: ({ data }) => (<DateFormatter date={data} time={true} />),
    structure_id: ({ rowData }) => <div>{get(rowData, 'structure_name') || '-'}</div>,
    brigade_employee_id_list: ({ data, rowData }) => (
      <div>
        {
          data.map((id) => (
            get(rowData, ['brigadeEmployeeIdIndex', id, 'employee_fio'], '-')
          )).join(', ')
        }
      </div>
    ),
  };
  return renderers;
};

const Table: React.FunctionComponent<any> = (props) => (
  <DataTable
    multiSelection={true}
    results={props.data}
    renderers={getRenders(props)}
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
