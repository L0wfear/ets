import React, { Component } from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import DateFormatter from 'components/ui/DateFormatter.jsx';

export const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props ? props.isOkrug : false,
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'full_name',
      displayName: 'Фамилия Имя Отчество',
      type: 'text',
      cssClassName: 'width300justify',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'birthday',
      displayName: 'Дата рождения',
      type: '',
      filter: {
        type: 'date',
      },
    },
    {
      name: 'personnel_number',
      displayName: 'Табельный номер',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'position_name',
      displayName: 'Должность',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'drivers_license',
      displayName: 'Водительское удостоверение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'special_license',
      displayName: 'Специальное удостоверение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'active',
      displayName: 'Текущее состояние',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: l => l ? 'Работает' : 'Не работает',
      },
    },
    {
      name: 'phone',
      displayName: 'Телефон',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'medical_certificate',
      displayName: 'Медицинская справка',
      type: 'text',
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
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'is_common',
      displayName: 'Общее',
      type: 'text',
      filter: {
        type: 'select',
        labelFunction: l => l ? 'Да' : 'Нет',
      },
    },
  ],
});

export default (props) => {
  const data = props.data;
  data.forEach((e, i) => {
    const last_name = e.last_name || '';
    const first_name = e.first_name || '';
    const middle_name = e.middle_name || '';
    e.full_name = last_name + ' ' + first_name + ' ' + middle_name;
  });

  const renderers = {
    birthday: ({ data }) => <DateFormatter date={data} />,
    active: ({ data }) => <div>{data === true ? 'Работает' : 'Не работает'}</div>,
    medical_certificate_date: ({ data }) => <DateFormatter date={data} />,
    is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
  };

  return (<Table
    title="Реестр сотрудников"
    results={data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'full_name'}
    {...props}
  />);
};
