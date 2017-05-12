import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'reports/efficiency/employee';
const reportUrl = 'employee-efficiency-report';
const serviceName = 'EmployeeEfficiencyReport';


const schemaMakers = {
  okrug_name: schema => multiselectFilterSchema(schema),
  district_name: schema => multiselectFilterSchema(schema),
  company_name: schema => multiselectFilterSchema(schema),
  fuel_type_name: schema => multiselectFilterSchema(schema),
  car_model_name: schema => multiselectFilterSchema(schema),
  car_gov_number: schema => multiselectFilterSchema(schema),
  employee_name: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Работа сотрудников по ручной уборке',
  serviceName,
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
