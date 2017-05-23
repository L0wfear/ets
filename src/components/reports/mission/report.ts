import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'car_travel_report';
const reportUrl = 'mission-reports';
const serviceName = 'MissionReportsService';

const schemaMakers = {
  ...commonSchemaMakers,
  city_name: schema => multiselectFilterSchema(schema),
};

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
