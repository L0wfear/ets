import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  carsList = [],
  insuranceTypeList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
        },
      },
      {
        name: 'insurer',
        displayName: 'Страховая организация',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'insurance_name',
        displayName: 'Наименование страхования',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'insurance_type_id',
        displayName: 'Тип страхования',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: insuranceTypeList.map(({ id, name }) => ({ value: id, label: name })),
        },
      },
      {
        name: 'seria',
        displayName: 'Серия',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'number',
        displayName: 'Номер',
        type: 'select',
        filter: {
          type: 'multiselect',
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
          type: 'date',
        },
      },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {
  const { insuranceTypeList = [], carsList = [], car_id = 0 } = props;

  const renderers: ISchemaRenderer = {
    insurance_type_id: ({ data }) => <div>{get(insuranceTypeList.find(s => s.id === data), 'name', '')}</div>,
    date_start: ({ data }) => <DateFormatter date={data} time={false} />,
    date_end: ({ data }) => <DateFormatter date={data} time={false} />,
    car_id: ({ data }) => <div>{get(carsList.find(s => s.asuods_id === data), 'gov_number', '---')}</div>,
  };

  let meta = tableMeta(props);
  if (!!car_id) {
    meta = { cols: meta.cols.filter(el => el.name !== 'car_id') };
  }

  return (
    <DataTable
      title="Реестр страховок"
      results={props.data}
      tableMeta={meta}
      renderers={renderers}
      noFilter={!!car_id}
      {...props}
    />
  );
};

export default Table;
