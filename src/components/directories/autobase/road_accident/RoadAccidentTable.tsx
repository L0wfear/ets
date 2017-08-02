import * as React from 'react';
import { get } from 'lodash';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  roadAccidentCauseList = [],
  driversList = [],
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'accident_date',
        displayName: 'Дата',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'driver_id',
        displayName: 'Водитель',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: driversList.map(el => ({ value: el.id, label: `${el.last_name} ${el.first_name[0]}.${el.middle_name ? el.middle_name[0] : ''}.`}) )
        },
      },
      {
        name: 'cause_id',
        displayName: 'Причина ДТП',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: roadAccidentCauseList.map(defaultSelectListMapper),
        },
      },
      {
        name: 'accident_place',
        displayName: 'Место ДТП',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'is_guilty',
        displayName: 'Виновность',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'damage_price',
        displayName: 'Стоимость ущерба, руб.',
        type: 'number',
        filter: {
          type: 'number',
        },
      },
      {
        name: 'comment',
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

const Table: React.SFC<any> = props  => {
  const {
          car_id = -1,
          roadAccidentCauseList = [],
          driversList= [],
        } = props;
  const driversList_option = driversList.map(el => ({ id: el.id, name: `${el.last_name} ${el.first_name[0]}.${el.middle_name ? el.middle_name[0] : ''}.`}) )

  const renderers: ISchemaRenderer = {
    accident_date: ({ data }) => (<DateFormatter date={data} />),
    driver_id: ({ data }) => <div>{get(driversList_option.find(s => s.id === data), 'name', '---')}</div>,
    cause_id: ({ data }) => <div>{get(roadAccidentCauseList.find(s => s.id === data), 'name', '---')}</div>,
    is_guilty: ({ data }) => <input type="checkbox" disabled checked={data} />,
  };

  return (
    <DataTable
      title="Ремонты ТС"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      noFilter={car_id !== -1}
      {...props}
    />
  );
};

export default Table;
