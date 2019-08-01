import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/car_downtime_and_overmileage/ReportHeader';

const serviceUrl = 'car_downtime_and_overmileage_report';
const reportUrl = 'car-downtime-and-overmileage-report';
const serviceName = 'CarDowntimeAndOvermileageReport';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Простои и перепробеги ТС при выполнении заданий',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
