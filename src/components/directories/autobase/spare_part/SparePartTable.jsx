import React from 'react';
import { get } from 'lodash';

import Table from 'components/ui/table/DataTable.jsx';

export const tableMeta = ({
  sparePartGroupList = [],
  measureUnitList = [],
}) => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Организация',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'spare_part_group_id',
      displayName: 'Группа',
      type: 'text',
      filter: {
        type: 'multiselect',
        options: sparePartGroupList.map(({ id, name }) => ({ value: id, label: name })),
      },
    },
    {
      name: 'number',
      displayName: 'Номер',
      type: 'number',
      filter: { type: 'text' },
    },
    {
      name: 'name',
      displayName: 'Наименование',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
    {
      name: 'measure_unit_id',
      displayName: 'Единица измерения',
      type: 'text',
      filter: {
        type: 'multiselect',
        options: measureUnitList.map(({ id, name }) => ({ value: id, label: name })),
      },
    },
    {
      name: 'price',
      displayName: 'Цена, руб.',
      type: 'text',
      filter: {
        type: 'text',
      },
    },
  ],
});

export default (props) => {
  const { measureUnitList = [], sparePartGroupList = [] } = props;

  const renderers = {
    spare_part_group_id: ({ data }) => <div>{get(sparePartGroupList.find(s => s.id === data), 'name', '')}</div>,
    measure_unit_id: ({ data }) => <div>{get(measureUnitList.find(s => s.id === data), 'name', '')}</div>,
  };

  return (<Table
    title="Реестр запчастей"
    results={props.data}
    renderers={renderers}
    tableMeta={tableMeta(props)}
    initialSort={''}
    {...props}
  />);
};
