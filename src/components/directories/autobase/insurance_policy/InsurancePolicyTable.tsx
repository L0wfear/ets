import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  car_id = -1,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'gov_number',
        displayName: 'Транспортное средство',
        display: car_id === -1,
        type: 'string',
        filter: car_id === -1 ? { type: 'multiselect' } : false,
      },
      {
        name: 'insurer',
        displayName: 'Страховая организация',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'insurance_type_name',
        displayName: 'Тип страхования',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'seria',
        displayName: 'Серия',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'string',
        filter: {
          type: 'advanced-string',
        },
      },
      {
        name: 'date_start',
        displayName: 'Дата начала действия',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'date_end',
        displayName: 'Дата окончания действия',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'price',
        displayName: 'Стоимость, руб.',
        type: 'number',
        filter: {
          type: 'advanced-number',
        },
      },
      {
        name: 'note',
        displayName: 'Примечание',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
    ],
  };

  return meta;
}

const renderers: ISchemaRenderer = {
  date_start: ({ data }) => <DateFormatter date={data} time={false} />,
  date_end: ({ data }) => <DateFormatter date={data} time={false} />,
};

const Table: React.FunctionComponent<any> = (props) => {
  const { car_id = -1 } = props;

  return (
    <DataTable
      title="Реестр страховок"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
