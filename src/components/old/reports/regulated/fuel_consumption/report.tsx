import * as React from 'react';

import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/regulated/fuel_consumption/ReportHeader';

const serviceUrl = 'fuel_consumption_new_report';
const reportUrl = 'fuel-consumption-report';
const serviceName = 'FuelReportService';

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
  title: 'Отчёт по топливу',
  serviceName,
  enumerated: true,
  enumeratedChildren: true,
  tableProps,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  schemaMakers,
  notUseServerSummerTable: true,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
