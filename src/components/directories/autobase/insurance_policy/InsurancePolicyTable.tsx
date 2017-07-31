import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta(): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'gov_number',
        displayName: 'Транспортное средство',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
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
        name: 'insurance_name',
        displayName: 'Наименование страхования',
        type: 'string',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'insurance_type_name',
        displayName: 'Тип страхования',
        type: 'select',
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
        type: 'number',
        filter: {
          type: 'number',
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
          type: 'number',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { car_id = -1 } = props;

  const renderers: ISchemaRenderer = {
    date_start: ({ data }) => <DateFormatter date={data} time={false} />,
    date_end: ({ data }) => <DateFormatter date={data} time={false} />,
  };

  let meta = tableMeta();
  if (car_id === -1) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }

  return (
    <DataTable
      title="Реестр страховок"
      results={props.data}
      tableMeta={meta}
      renderers={renderers}
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
