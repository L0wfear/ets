import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { parseMultiSelectListQueryParams } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'cleaning_status_report';
const reportUrl = 'daily-cleaning-reports-ets';
const serviceName = 'DailyCleaningReportsServiceETS';

const schemaMakers = {};

const renderers = {
  cars_gov_numbers: ({ data }) => <span>{data.join(', ')}</span>,
};

const headerStateMaker = queryState => parseMultiSelectListQueryParams(queryState, ['car_func_types_ids']);

const reportProps: IReportProps = {
  title: 'Статус по уборке',
  enumerated: true,
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  schemaMakers,
  headerStateMaker,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
