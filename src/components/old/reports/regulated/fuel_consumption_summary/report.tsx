import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/regulated/fuel_consumption_summary/ReportHeader';

const serviceUrl = 'fuel_consumption_summary_report';
const reportUrl = 'fuel-consumption-summary-report';
const serviceName = 'FuelSummaryReportService';

const schemaMakers = {};

export const renderers = ({
  okrug_name: ({ data }) => <div>{data || '-'}</div>,
  district_name: ({ data }) => <div>{data || '-'}</div>,
  structure_name: ({ data }) => <div>{data || '-'}</div>,
});

const tableProps = {
  rowNumberLabel: '№ п/п',
  rowNumberClassName: 'width60',
};

const reportProps: IReportProps = {
  title: 'Сводный отчет расхода топлива',
  serviceName,
  enumerated: true,
  tableProps,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
