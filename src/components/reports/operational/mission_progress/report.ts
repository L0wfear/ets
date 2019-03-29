import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/mission_progress/ReportHeader';

const serviceUrl = 'mission_progress_report';
const reportUrl = 'mission-progress-report';
const serviceName = 'MissionProgressReportService';

const schemaMakers = {};
const renderers = {};
const tableProps = {};

const reportProps: IReportProps = {
  title: 'Отчет посещения ОДХ и ДТ',
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
