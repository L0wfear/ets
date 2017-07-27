import React, { Component } from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';
import { defaultSelectListMapper } from 'components/ui/input/EtsSelect';

export const tableMeta = ({
  companyStructureList = [],
  isOkrug = false,
 } = {}) => (
  {
    cols: [
      {
        name: 'company_name',
        displayName: 'Учреждение',
        type: 'text',
        display: isOkrug,
        filter: isOkrug ? { type: 'multiselect' } : false,
      },
      {
        name: 'object_address',
        displayName: 'Название ДТ',
        type: 'string',
        filter: {
          type: 'multiselect',
        },
      },
      {
        name: 'total_area',
        displayName: 'Общая площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'clean_area',
        displayName: 'Общая уборочная площадь (кв.м.)',
        type: 'number',
      },
      {
        name: 'auto_area',
        displayName: 'Площадь механизированной уборки (кв.м.)',
        type: 'number',
      },
      {
        name: 'company_structure_id',
        displayName: 'Подразделение',
        type: 'string',
        filter: {
          type: 'multiselect',
          options: companyStructureList.map(defaultSelectListMapper),
        },
      },
    ],
  }
);

export default (props) => {
  const { companyStructureList = [] } = props;

  const renderers = {
    company_structure_id: ({ data }) => <div>{get(companyStructureList.find(s => s.id === data), 'name', '---')}</div>,
  };

  return (<Table
    title="Реестр ДТ"
    results={props.data}
    tableMeta={tableMeta(props)}
    renderers={renderers}
    initialSort={'name'}
    {...props}
  />);
};
