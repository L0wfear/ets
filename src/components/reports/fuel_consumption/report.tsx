import * as React from 'react';
import { withProps } from 'recompose';
import { get } from 'lodash';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'fuel_consumption_report';
const reportUrl = 'fuel-consumption-report';
const serviceName = 'FuelReportService';

const schemaMakers = {};

const renderers = {
  track_length: ({ rowData }) => <span>{get(rowData, 'track_length', '-')}</span>,
  length_diff: ({ rowData }) => <span>{get(rowData, 'length_diff', '-')}</span>,
};

const tableProps = {
  rowNumberLabel: "№ п/п",
  rowNumberClassName: "width60",
};

const reportProps: IReportProps = {
  title: 'Отчёт по топливу',
  serviceName,
  enumerated: true,
  tableProps,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
