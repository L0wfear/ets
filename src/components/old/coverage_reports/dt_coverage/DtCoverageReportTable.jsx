import React from 'react';
import Table from 'components/ui/table/DataTable';
import { floatFixed1Percentage } from 'utils/renderers/index';

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
    <div className="top-right">Вид операции</div>
    <div className="bottom-left">Учреждение</div>
  </div>,
      },
      {
        name: 'percentage_one_distance',
        displayName: 'Содержание ДТ',
        type: 'floatFixed1',
      },
      {
        name: 'percentage_one_passes',
        displayName: 'Выполнение тех. операций по содержанию ДТ',
        type: 'floatFixed1',
      },
    ],
  };

  return tableMeta;
};

const DtCoverageReportTable = (props) => {
  const renderers = {
    percentage_one_distance: floatFixed1Percentage,
    percentage_one_passes: floatFixed1Percentage,
  };

  return (
    <Table
      title="Отчет по посещению ДТ"
      noFilter
      results={props.data}
      renderers={renderers}
      enumerated={false}
      tableMeta={getTableMeta(props)}
      className="waybills-table"
      initialSort={props.selectField}
      {...props}
    />
  );
};

export default DtCoverageReportTable;
