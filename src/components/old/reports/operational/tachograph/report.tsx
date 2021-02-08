import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/tachograph/ReportHeader';

const serviceUrl = 'autobase/report/tachograph';
const reportUrl = 'tachograph';
const serviceName = 'TachographReport';

const schemaMakers: ISchemaMaker = {

};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Отчет по тахографам',
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
