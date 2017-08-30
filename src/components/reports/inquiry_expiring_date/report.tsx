import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';
import DateFormatter from 'components/ui/DateFormatter';

const serviceUrl = 'autobase/reports/inquiry_expiring_date';
const reportUrl = 'inquiry-expiring-date';
const serviceName = 'InquiryExpiringDate';

const schemaMakers = {};

const renderers = {
  inquiry_date_end: ({ data }) => <DateFormatter date={data} />,
};

const reportProps: IReportProps = {
  title: 'Перечень справок, по которым подходит дата окончания действия',
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
