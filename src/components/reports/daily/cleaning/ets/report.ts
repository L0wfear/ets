import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'cleaning_status_report';
const reportUrl = 'daily-cleaning-reports-ets';
const serviceName = 'DailyCleaningReportsServiceETS';

const schemaMakers = {
  ...commonSchemaMakers,
  geozone_name: schema => multiselectFilterSchema(schema),
  cars_func_type_name: schema => multiselectFilterSchema(schema),
  progress_status: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Статус по уборке',
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
