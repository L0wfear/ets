import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

function getProperties(value) {
  const properties = {
    total_area: 'Общая площадь (кв.м.)',
    distance: 'Протяженность (п.м.)',
    roadway_area: 'Площадь проезжей части (кв.м.)',
    footway_area: 'Площадь тротуаров (кв.м.)',
    cleaning_area: 'Площадь уборки (кв.м.)',
    auto_footway_area: 'Площадь механизированной уборки тротуаров (кв.м.)',
    manual_footway_area: 'Площадь ручной уборки тротуаров (кв.м.)',
    snow_area: 'Площадь уборки снега (кв.м.)',
    gutters_length: 'Протяженность лотков (п.м.)',
    clean_area: 'Общая уборочная площадь (кв.м.)',
    mechanical_clean_area: 'Площадь механизированной уборки (кв.м.)',
    station_number: 'Кол-во убираемых остановок (ед.)',
  };
  return properties[value];
}

const tableMeta = {
  cols: [
    {
      name: 'technical_operation_name',
      displayName: 'Технологическая операция',
      type: 'string',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'property',
      displayName: 'Площадная характеристика',
      filter: {
        type: 'multiselect',
        labelFunction: v => getProperties(v),
      },
      cssClassName: 'width150',
    },
    {
      name: 'value',
      displayName: 'Коэффициент',
      cssClassName: 'width80',
    },
    {
      name: 'measure_unit_name',
      displayName: 'Единица измерения',
      cssClassName: 'width80',
    },
  ],
};

export default (props) => {
  const renderers = {
    property: ({ data }) => <div>{getProperties(data)}</div>,
  };

  return (
    <Table
      title="Показатели для расчета эффективности работы бригад"
      results={props.data}
      tableMeta={tableMeta}
      renderers={renderers}
      {...props}
    />
  );
};
