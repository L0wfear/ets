import * as React from 'react';
import Table from 'components/old/ui/table/DataTable';
import { floatFixed1Percentage } from 'utils/renderers/index';

const getTableMeta = () => {
  const tableMeta = {
    cols: [
      {
        name: 'company_name',
        displayName: 'Учреждение',
        type: 'string',
        cssClassName: 'width200',
        customHeaderComponent: (
          <div className="diagonal-header">
            <div className="top-right">Вид операции</div>
            <div className="bottom-left">Учреждение</div>
          </div>
        ),
      },
      {
        name: 'percentage_one_distance',
        displayName: 'Содержание тротуаров',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_one_passes',
        displayName: 'Выполнение тех. операций по содержанию тротуаров',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_two_distance',
        displayName: 'Содержание проезжей части',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_two_passes',
        displayName: 'Выполнение тех. операций по проезжей части',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_three_distance',
        displayName: 'Содержание лотков и осевых на проезжей части',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_three_passes',
        displayName:
          'Выполнение тех. операций по содержанию лотков и осевых на проезжей части',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_four_distance',
        displayName: 'Содержание проезжей части (общее)',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_four_passes',
        displayName: 'Выполнение тех.операций по проезжей части (общее)',
        type: 'floatFixed1',
      },
      // {
      //   name: 'total_percentage',
      //   displayName: 'Итого',
      //   type: 'floatFixed1',
      // },
    ],
  };

  return tableMeta;
};

const OdhCoverageReportTable = (props) => {
  const renderers = {
    percentage_one_distance: floatFixed1Percentage,
    percentage_one_passes: floatFixed1Percentage,
    percentage_two_distance: floatFixed1Percentage,
    percentage_two_passes: floatFixed1Percentage,
    percentage_three_distance: floatFixed1Percentage,
    percentage_three_passes: floatFixed1Percentage,
    percentage_four_distance: floatFixed1Percentage,
    percentage_four_passes: floatFixed1Percentage,
    total_percentage: floatFixed1Percentage,
  };

  return (
    <Table
      title="Отчет по посещению ОДХ"
      noFilter
      results={props.data}
      renderers={renderers}
      enumerated={false}
      tableMeta={getTableMeta()}
      className="waybills-table"
      {...props}
    />
  );
};

export default OdhCoverageReportTable;
