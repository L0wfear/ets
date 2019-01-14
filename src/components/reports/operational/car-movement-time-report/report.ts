import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/car-movement-time-report/ReportHeader';

const serviceUrl = 'car_movement_time_report';
const reportUrl = 'car-movement-time-report';
const serviceName = 'CarMovementTimeReportService';

const schemaMakers = {};
const renderers = {};
const tableProps = {};

const reportProps: IReportProps = {
  title: 'Время движения ТС',
  serviceName,
  enumerated: true,
  tableProps,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
