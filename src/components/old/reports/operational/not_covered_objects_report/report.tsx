import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaRenderer, ISchemaMaker } from 'components/old/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/not_covered_objects_report/ReportHeader';

const serviceUrl = 'report/not_covered_objects_report';
const reportUrl = 'not-covered-objects-report';
const serviceName = 'NotCoveredObjectsReportService';

const schemaMakers: ISchemaMaker = {};

const renderers: ISchemaRenderer = {};

const reportProps: IReportProps = {
  title: 'ОДХ/ДТ и элементы, не назначенные на централизованные задания',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
  tableProps: { reportKey: serviceUrl },
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
