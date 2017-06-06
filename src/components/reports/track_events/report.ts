import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'track_events';
const reportUrl = 'track-events-reports';
const serviceName = 'TrackEventsReportService';


const schemaMakers = {
  ...commonSchemaMakers,
  fuel_type_name: schema => multiselectFilterSchema(schema),
  car_model_name: schema => multiselectFilterSchema(schema),
  car_gov_number: schema => multiselectFilterSchema(schema),
  employee_name: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Отчет по возможным сливам топлива',
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
