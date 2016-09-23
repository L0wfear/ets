import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const getCondition = data => parseInt(data, 10) > 0 ? 'Исправно' : 'Неисправно';

const tableMeta = {
  cols: [
    {
      name: 'gov_number',
      displayName: 'Рег. номер ТС',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'special_model_name',
      displayName: 'Модель ТС',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'model_name',
      displayName: 'Марка шасси ТС',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'type',
      displayName: 'Тип',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'condition',
      displayName: 'Состояние',
      type: 'text',
      filter: {
        type: 'select',
        labelFunction: getCondition,
      },
    },
    {
      name: 'garage_number',
      displayName: 'Гаражный номер',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'fuel_correction_rate',
      displayName: 'Поправочный коэффициент',
      type: 'number',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение предприятия',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'gps_code',
      displayName: 'Код БНСО',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
    {
      name: 'equipment',
      displayName: 'Оборудование ДКМ',
      type: 'text',
      filter: {
        type: 'select',
      },
    },
  ],
};

const CarsTable = (props) => {
  const renderers = {
    condition: ({ data }) => <div>{getCondition(data)}</div>,
    fuel_correction_rate: ({ data }) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
    garage_number: ({ data }) => <div>{data && data !== 'null' ? data : ''}</div>,
    model_name: ({ data }) => <div className="white-space-pre-wrap">{data}</div>,
  };

  return (<Table
    title="Реестр транспортных средств"
    tableMeta={tableMeta}
    results={props.data}
    renderers={renderers}
    {...props}
  />);
};

export default CarsTable;
