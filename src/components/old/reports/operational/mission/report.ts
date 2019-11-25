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
  title: 'Отчет по прохождению заданий',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
  summaryTitle: 'Итого',
  notUseServerSummerTable: true,
  tableProps: {
    reportKey: serviceUrl,
  },
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
