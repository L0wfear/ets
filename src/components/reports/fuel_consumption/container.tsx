import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'fuel_consumption_report';
const reportUrl = 'fuel-consumption-report';
const serviceName = 'FuelReportService';

const renderers = {};
const schemaRenderers = {};

const reportProps: IReportProps = {
  title: 'Отчёт по топливу',
  serviceName,
  reportUrl,
  headerComponent: ReportHeader,
  renderers,
  schemaRenderers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
