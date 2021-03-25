import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader, { dateRangeDefault } from 'components/old/reports/operational/inspection_cars_usage/ReportHeader';
import { ISchemaRenderer, ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import { createValidDate } from 'components/@next/@utils/dates/dates';

const serviceUrl = 'report/inspection_cars_usage';
const reportUrl = 'inspection_cars_usage';
const serviceName = 'InspectionCarsUsage';

const schemaMakers: ISchemaMaker = {};

const renderers: ISchemaRenderer = {};

const reportProps: IReportProps = {
  title: 'Отчет по эксплуатации техники',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  schemaMakers,
  renderers,
  initialLoadPayload: {
    date_from: createValidDate(dateRangeDefault.date_from),
    date_to: createValidDate(dateRangeDefault.date_to),
  },
  notUseServerSummerTableForPrint: true,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
