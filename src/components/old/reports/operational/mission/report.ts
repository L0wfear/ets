import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/mission/ReportHeader';

const serviceUrl = 'car_travel_report';
const reportUrl = 'mission-reports';
const serviceName = 'MissionReportsService';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Прохождение заданий',
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
