import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/cars_travel_time/ReportHeader';

const serviceUrl = 'cars_travel_time';
const reportUrl = 'cars_travel_time';
const serviceName = 'CarsTravelTimeReport';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Время движения ТС по заданиям',
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
