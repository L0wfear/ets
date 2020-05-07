import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/inquiry_expiring_date/ReportHeader';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';

const serviceUrl = 'autobase/reports/inquiry_expiring_date';
const reportUrl = 'inquiry-expiring-date';
const serviceName = 'InquiryExpiringDate';

const schemaMakers = {
  inquiry_date_end: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
};

const renderers = {
  inquiry_date_end: ({ data }) => makeDateFormated(data),
};

const tableProps = {
  initialSort: 'inquiry_date_end',
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
  tableProps,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
