import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { parseMultiSelectListQueryParams } from 'components/old/reports/common/utils';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/regulated/cleaning_status_tech_op/ReportHeader';

const serviceUrl = 'cleaning_status_tech_op_report';
const reportUrl = 'cleaning-status-tech-op-report';
const serviceName = 'CleaningStatusTechOpReportService';

const schemaMakers = {
  cars_gov_numbers: (schema) => ({
    ...schema,
    filter: false,
  }),
};

const renderers = {
  cars_gov_numbers: ({ data }) => <span>{data.join(', ')}</span>,
};

const headerStateMaker = (queryState) => parseMultiSelectListQueryParams(queryState, ['car_func_types_ids']);

const reportProps: IReportProps = {
  title: 'Статус по выполнению городских заданий',
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
