import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = '/reports/efficiency/brigade';
const reportUrl = 'brigade-efficiency-report';
const serviceName = 'BrigadeEfficiencyReport';


const schemaMakers = {
  okrug_name: schema => multiselectFilterSchema(schema),
  district_name: schema => multiselectFilterSchema(schema),
  company_name: schema => multiselectFilterSchema(schema),
  technical_operation_name: schema => multiselectFilterSchema(schema),
  foreman_name: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Работа бригад по ручной уборке',
  serviceName,
  reportUrl,
  serviceUrl,
  enumerated: true,
  headerComponent: ReportHeader,
  renderers,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
