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
  data = [],
} = {}): IDataTableSchema {
  const data__car_id = data.map(el => el.car_id);
  const trueCarsList = carsList.reduce((arr, el) => {
    if (data__car_id.includes(el.asuods_id)) {
      arr.push({ value: el.asuods_id, label: el.gov_number });
    }
    return arr;
  }, []);
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'car_id',
        displayName: 'Транспортное средство',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: trueCarsList,
          // options: carsList.map(el => ({ value: el.asuods_id, label: el.gov_number })),
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
          //options: insuranceTypeList.map(({ id, name }) => ({ value: id, label: name })),
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
  const { insuranceTypeList = [], carsList = [], car_id = -1 } = props;

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
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
