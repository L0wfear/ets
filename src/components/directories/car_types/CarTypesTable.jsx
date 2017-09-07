import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'full_name',
      displayName: 'Полное наименование',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'short_name',
      displayName: 'Краткое наименование',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'plow_width_odh',
      displayName: 'Ширина уборочного оборудования на ОДХ',
      type: 'string',
    },
    {
      name: 'plow_width_dt',
      displayName: 'Ширина уборочного оборудования на ДТ',
      type: 'string',
    },
    
    {
      name: 'season_name',
      displayName: 'Сезон',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'speed_limit',
      displayName: 'Максимальная скорость',
      type: 'select',
      filter: {
        type: 'multiselect',
      },
    },
  ],
};

export default (props) => {
  return (
    <Table
      title="Типы техники"
      results={props.data}
      tableMeta={tableMeta}
      initialSort={undefined}
      {...props}
      onRowSelected={undefined}
    />
  );
};
