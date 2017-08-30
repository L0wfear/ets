import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isOkrug = false,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'string',
      display: isOkrug,
      filter: isOkrug && { type: 'multiselect' } || false,
    },
    {
      name: 'full_name',
      displayName: 'Фамилия Имя Отчество',
      type: 'string',
      cssClassName: 'width300justify',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'birthday',
      displayName: 'Дата рождения',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'personnel_number',
      displayName: 'Табельный номер',
      type: 'string',
      filter: {
        type: 'string',
      },
    },
    {
      name: 'position_name',
      displayName: 'Должность',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'drivers_license',
      displayName: 'Водительское удостоверение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'special_license',
      displayName: 'Специальное удостоверение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'active',
      displayName: 'Текущее состояние',
      type: 'string',
      filter: {
        type: 'multiselect',
        labelFunction: l => l ? 'Работает' : 'Не работает',
      },
    },
    {
      name: 'phone',
      displayName: 'Телефон',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'medical_certificate',
      displayName: 'Медицинская справка',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'medical_certificate_date',
      displayName: 'Срок действия мед. справки',
      type: 'date',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'snils',
      displayName: 'СНИЛС №',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'is_common',
      displayName: 'Общее',
      type: 'select',
      filter: {
        type: 'multiselect',
        options: [{ value: +true, label: 'Да' }, { value: +false, label: 'Нет' }],
      },
    },
    ],
  };

  return meta;
}

const Table: React.SFC<any> = props  => {

  const renderers: ISchemaRenderer = {
    full_name: ({ rowData }) => <span>{`${rowData.last_name || ''} ${rowData.first_name || ''} ${rowData.middle_name || ''}`}</span>,
    birthday: ({ data }) => <DateFormatter date={data} />,
    active: ({ data }) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
    medical_certificate_date: ({ data }) => <DateFormatter date={data} />,
    is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
  };

  return (
    <DataTable
      title="Реестр сотрудников"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      initialSort={'full_name'}
      {...props}
    />
  );
};

export default Table;
