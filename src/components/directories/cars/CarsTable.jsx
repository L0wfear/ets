import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';

const getCondition = data => parseInt(data, 10) > 0 ? 'Исправно' : 'Неисправно';

const tableMeta = props => ({
  cols: [
    {
      name: 'company_name',
      displayName: 'Учреждение',
      type: 'text',
      display: props.isOkrug,
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'gov_number',
      displayName: 'Рег. номер ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'special_model_name',
      displayName: 'Модель ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'model_name',
      displayName: 'Марка шасси ТС',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'type',
      displayName: 'Тип',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'condition',
      displayName: 'Состояние',
      type: 'text',
      filter: {
        type: 'multiselect',
        labelFunction: getCondition,
      },
    },
    {
      name: 'garage_number',
      displayName: 'Гаражный номер',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'fuel_correction_rate',
      displayName: 'Поправочный коэффициент',
      type: 'number',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'company_structure_name',
      displayName: 'Подразделение предприятия',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'gps_code',
      displayName: 'Код БНСО',
      type: 'text',
      filter: {
        type: 'multiselect',
      },
    },
    {
      name: 'equipment',
      displayName: 'Оборудование ДКМ',
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
        options: [{ label: 'Да', value: 1 }, { label: 'Нет', value: 0 }],
      },
    },
  ],
});

const CarsTable = (props) => {
  const renderers = {
    condition: ({ data }) => <div>{getCondition(data)}</div>,
    fuel_correction_rate: ({ data }) => <div>{data ? parseFloat(data).toFixed(2) : ''}</div>,
    garage_number: ({ data }) => <div>{data && data !== 'null' ? data : ''}</div>,
    model_name: ({ data }) => <div className="white-space-pre-wrap">{data}</div>,
    is_common: ({ data }) => <input type="checkbox" disabled checked={!!data} />,
  };

  return (<Table
    title="Реестр транспортных средств"
    tableMeta={tableMeta(props)}
    results={props.data}
    renderers={renderers}
    {...props}
  />);
};

export default CarsTable;
