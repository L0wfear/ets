import * as React from 'react';

import { IDataTableSchema } from 'components/ui/table/@types/schema.h';
import { ISchemaRenderer } from 'components/ui/table/@types/schema.h';
import { IPropsDataTable } from 'components/ui/table/@types/DataTable.h';

import DataTableComponent from 'components/ui/table/DataTable';
import DateFormatter from 'components/ui/DateFormatter';

const DataTable: React.ComponentClass<IPropsDataTable<any>> = DataTableComponent as any;

export function tableMeta({
  isOkrug = false,
  isKgh = false,
} = {}): IDataTableSchema {
  const meta: IDataTableSchema = {
    cols: [
      {
        name: 'company_name',
        displayName: isKgh ? 'Наименование ГБУ' : 'Учреждение',
        type: 'string',
        display: isOkrug || isKgh,
        filter: (isOkrug || isKgh) ? { type: 'multiselect' } : false,
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
        name: 'prefer_car_text',
        displayName: 'Основное ТС',
        type: 'string',
        filter: false,
      },
      {
        name: 'secondary_car_text',
        displayName: 'Вторичное ТС',
        type: 'string',
        filter: false,
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
        name: 'drivers_license_date_end',
        displayName: 'Срок действия водительского удостоверения',
        type: 'date',
        filter: {
          type: 'date',
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
        name: 'special_license_date_end',
        displayName: 'Срок действия специального удостоверения',
        type: 'date',
        filter: {
          type: 'date',
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
          labelFunction: (l) => l ? 'Работает' : 'Не работает',
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
        name: 'is_common',
        displayName: 'Общее',
        type: 'select',
        filter: {
          type: 'multiselect',
          options: [{ value: +true, label: 'Да' }, { value: +false, label: 'Нет' }],
        },
      },
      {
        name: 'has_car',
        displayName: 'Показать незакрепленных за ТС водителей',
        type: 'select',
        display: false,
        filter: {
          type: 'select',
          options: [
            { value: 'TRUE', label: 'Нет' },
            { value: 'False', label: 'Да' },
          ],
        },
      },
    ],
  };
  return meta;
}

const Table: React.FunctionComponent<any> = (props) => {
  const renderers: ISchemaRenderer = {
    full_name: ({ rowData }) => <span>{`${rowData.last_name || ''} ${rowData.first_name || ''} ${rowData.middle_name || ''}`}</span>,
    birthday: ({ data }) => <DateFormatter date={data} />,
    active: ({ data }) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
    medical_certificate_date: ({ data }) => <DateFormatter date={data} />,
    is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
    drivers_license_date_end: ({ data }) => <DateFormatter date={data} />,
    special_license_date_end: ({ data }) => <DateFormatter date={data} />,
    prefer_car: ({ data }) => <span>{props.carsIndex[data] ? props.carsIndex[data].gov_number : ''}</span>,
    secondary_car: ({ data, rowData }) => <span>{(data || []).reduce((newStr, id) => `${newStr}${props.carsIndex[id] ? `${!newStr ? '' : ', '}${props.carsIndex[id].gov_number}` : ''}`, '')}</span>,
  };

  return (
    <DataTable
      title="Реестр сотрудников"
      results={props.data}
      tableMeta={tableMeta(props)}
      renderers={renderers}
      initialSort={'full_name'}
      initialSortAscending={true}
      {...props}
    />
  );
};

export default Table;
