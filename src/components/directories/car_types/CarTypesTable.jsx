import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const tableMeta = {
  cols: [
    {
      name: 'full_name',
      displayName: 'Полное наименование',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
      cssClassName: 'width300',
    },
    {
      name: 'short_name',
      displayName: 'Краткое наименование',
      type: 'string',
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
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'speed_max',
      displayName: 'Максимальная скорость',
      type: 'string',
    },
  ],
};

export default (props) => {
  return (
    <Table
      title="Типы техники"
      results={props.data}
      tableMeta={tableMeta}
      initialSort={'full_name'}
      {...props}
    />
  );
};
