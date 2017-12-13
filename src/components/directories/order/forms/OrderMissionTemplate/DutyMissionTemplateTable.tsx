import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import { getTableMeta as getMissionTempalteTableMeta } from 'components/missions/duty_mission_template/DutyMissionTemplatesTable.jsx';
import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function getTableMeta(props: any = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'date_from',
        displayName: 'Начало действия поручения',
        type: 'date',
        filter: false,
      },
      {
        name: 'date_to',
        displayName: 'Окончание действия поручения',
        type: 'date',
        filter: false,
      },
      ...getMissionTempalteTableMeta(props).cols.map(({ name, displayName, type, display: displayOuter }) => ({
        name,
        displayName,
        type,
        filter: false,
        display: typeof displayOuter === 'boolean' ? displayOuter : true,
      })),
    ],
  };
  return meta;
}

const getRenders = props => {
  const renderers: ISchemaRenderer = {
    date_from: ({ data }) => (<DateFormatter date={data} time={true} />),
    date_to: ({ data }) => (<DateFormatter date={data} time={true} />),
    structure_id: ({ data }) => <div>{props.structures.find(s => s.id === data) ? props.structures.find(s => s.id === data).name : ''}</div>,
  };
  return renderers;
};

const Table: React.SFC<any> = props  => (
  <DataTable
    multiSelection={true}
    noFilter={true}
    results={props.data}
    renderers={getRenders(props)}
    tableMeta={getTableMeta(props)}
    onRowSelected={props.onRowSelected}
    onRowChecked={props.onRowChecked}
    onAllRowsChecked={props.onAllRowsChecked}
    selected={props.selected}
    checked={props.checked}
  />
);

export default Table;
