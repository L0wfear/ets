import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/employee_efficiency/ReportHeader';

const serviceUrl = 'reports/efficiency/employee';
const reportUrl = 'employee-efficiency-report';
const serviceName = 'EmployeeEfficiencyReport';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Работа сотрудников по ручной уборке',
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
