import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';
import DateFormatter from 'components/ui/DateFormatter';

const serviceUrl = 'autobase/reports/long_repair';
const reportUrl = 'long-repair';
const serviceName = 'LongRepair';

const schemaMakers = {};

const renderers = {
  fact_date_start: ({ data }) => <DateFormatter date={data} />,
  fact_date_end: ({ data }) => <DateFormatter date={data} />,
  plan_date_start: ({ data }) => <DateFormatter date={data} />,
  plan_date_end: ({ data }) => <DateFormatter date={data} />,
};

const reportProps: IReportProps = {
  title: 'Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  enumerated: true,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
