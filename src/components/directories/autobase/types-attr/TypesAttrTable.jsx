import React from 'react';
import Table from 'components/ui/table/DataTable';

const tableMeta = {
  cols: [
    {
      name: 'oper_type_name',
      displayName: 'Сезон',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'work_class_short_name',
      displayName: 'Объект ГХ',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'short_name',
      displayName: 'Тип техники',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'speed_lim',
      displayName: 'Максимально допустимая скорость, км/ч',
      type: 'select',
      filter: false,
    },
    {
      name: 'mkad_speed_lim',
      displayName: 'Максимально допустимая скорость на МКАД, км/ч',
      type: 'select',
      filter: false,
    },
    {
      name: 'equip_width',
      displayName: 'Ширина уборочного оборудования, м',
      type: 'select',
      filter: false,
    },
  ],
};

export default props => (
  <Table
    title="Таблица нормативных скоростей и ширин"
    results={props.data}
    tableMeta={tableMeta}
    {...props}
    onRowSelected={undefined}
  />
);
