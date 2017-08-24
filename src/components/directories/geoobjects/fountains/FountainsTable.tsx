import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
} = {}) {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'name',
        displayName: 'Наименование',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'adm_area',
        displayName: 'Административный округ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'district',
        displayName: 'Район',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'location',
        displayName: 'Адресный ориентир',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'departmental_affiliation',
        displayName: 'Ведомственная принадлежность',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'working_hours',
        display: false,
        displayName: 'График работы',
        type: 'array',
        filter: false,
      },
      {
        name: 'balance_holder_name',
        displayName: 'Балансодержатель',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'balance_holder_phone',
        displayName: 'Телефон балансодержателя',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'balance_holder_email',
        displayName: 'Электронная почта балансодержателя',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'balance_holder_web_site',
        displayName: 'Сайт балансодержателя',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'operation_organization_name',
        displayName: 'Эксплуатирующая организация',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'operation_organization_phone',
        displayName: 'Телефон эксплуатирующей организации',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'operation_organization_email',
        displayName: 'Электронная почта эксплуатирующей организации',
        display: false,
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
    ],
  };

  return meta;
}

export const WorkingHours = ({ day, hours, key }) => <div key={key}>{`${day}: ${hours}`}</div>;

export const renderers = {
  working_hours: ({ data }) =>
  <div>
    {data.map((item, i) => <WorkingHours key={i} day={item.DayOfWeek} hours={item.Hours} />)}
  </div>,
  balance_holder_web_site: ({ data }) => <a href={`//${data}`}>{data}</a>,
};

export default (props) => {
  return (
    <DataTable
      title="Фонтаны"
      results={props.data}
      renderers={renderers}
      enumerated
      tableMeta={tableMeta(props)}
      {...props}
    />
  );
};
