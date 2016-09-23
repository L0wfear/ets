import React from 'react';
import Table from 'components/ui/table/DataTable.jsx';
import { floatFixed1Percentage } from 'utils/renderers';

const getTableMeta = () => {
  const tableMeta = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Учреждение',
        type: 'string',
        cssClassName: 'width200',
        customHeaderComponent:
          <div className="diagonal-header">
            <div className="top-right">Тип ТС</div>
            <div className="bottom-left">Учреждение</div>
          </div>,
      },
      {
        name: 'percentage_one',
        displayName: 'Тротуаро-уборочная техника',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_two',
        displayName: 'Поливомоечная техника',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_three',
        displayName: 'Подметательно-уборочная техника',
        type: 'floatFixed1',
      },
      {
        name: 'total_percentage',
        displayName: 'Итого',
        type: 'floatFixed1',
      },
    ],
  };

  return tableMeta;
};

const OdhCoverageReportTable = (props) => {
  const renderers = {
    percentage_one: floatFixed1Percentage,
    percentage_two: floatFixed1Percentage,
    percentage_three: floatFixed1Percentage,
    total_percentage: floatFixed1Percentage,
  };

  return (
    <Table
      title="Фактическое выполнение заданий за смену"
      noFilter
      results={props.data}
      renderers={renderers}
      enumerated={false}
      tableMeta={getTableMeta(props)}
      className="waybills-table"
      {...props}
    />
  );
};

export default OdhCoverageReportTable;
