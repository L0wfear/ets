import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import { multiselectFilterSchema, commonSchemaMakers } from 'components/reports/common/utils';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'fuel_consumption_summary_report';
const reportUrl = 'fuel-consumption-summary-report';
const serviceName = 'FuelSummaryReportService';

const schemaMakers = {
  ...commonSchemaMakers,
  technical_operation_name: schema => multiselectFilterSchema(schema),
  fuel_type_name: schema => multiselectFilterSchema(schema),
  car_model_name: schema => multiselectFilterSchema(schema),
  special_model_name: schema => multiselectFilterSchema(schema),
  car_gov_number: schema => multiselectFilterSchema(schema),
};

const renderers = {};

const tableProps = {
  rowNumberLabel: "№ п/п",
  rowNumberClassName: "width60",
};

const reportProps: IReportProps = {
  title: 'Сводный отчет расхода топлива',
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
