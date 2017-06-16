import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { parseMultiSelectListQueryParams } from 'components/reports/common/utils';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'route_odh_coverage_report';
const reportUrl = 'route-odh-coverage-report';
const serviceName = 'RouteODHCoverageReportService';

const schemaMakers = {
  routes_names: schema => ({
    ...schema,
    filter: {
      type: 'string',
    },
  }),
};
const renderers = {
  routes_names: ({ data }) => <span>{data.join(', ')}</span>,
};
const headerStateMaker = queryState => parseMultiSelectListQueryParams(queryState, ['technical_operations_ids']);

const reportProps: IReportProps = {
  title: 'Покрытие ОДХ маршрутами',
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
