import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_id',
        displayName: 'Исполнитель ремонта',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'tech_maintenance_order_id',
        displayName: 'Регламент ТО',
        type: 'select',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'number',
        displayName: 'Номер документа',
        type: 'text',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'plan_date_start',
        displayName: 'Плановая дата начала',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'plan_date_end',
        displayName: 'Плановая дата окончания',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_start',
        displayName: 'Фактическая дата начала',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'fact_date_end',
        displayName: 'Фактическая дата окончания',
        type: 'date',
        filter: {
          type: 'date',
        },
      },
      {
        name: 'motohours_fact',
        displayName: 'Пробег на момент ТО, км',
        type: 'number',
        filter: {
          type: 'string',
        },
      },
      {
        name: 'odometr_fact',
        displayName: 'Счетчик м/ч на момент ТО, м/ч',
        type: 'number',
        filter: {
          type: 'string',
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

};

const Table: React.SFC<any> = props => {
  return (
    <DataTable
      title="Тех. обслуживание"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      // initialSort={'full_name'}
      {...props}
    />
  );
};

export default Table;
