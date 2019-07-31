import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { parseMultiSelectListQueryParams } from 'components/old/reports/common/utils';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/regulated/daily_cleaning_cafap/ReportHeader';

const serviceUrl = 'cleaning_status_cafap_report';
const reportUrl = 'daily-cleaning-reports-cafap';
const serviceName = 'DailyCleaningReportsServiceCAFAP';

const schemaMakers = {};

const renderers = {
  cars_gov_numbers: ({ data }) => <span>{data.join(', ')}</span>,
};

const headerStateMaker = (queryState) => parseMultiSelectListQueryParams(queryState, ['car_func_types_groups']);

const reportProps: IReportProps = {
  title: 'Статус по уборке (ЦАФАП)',
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
