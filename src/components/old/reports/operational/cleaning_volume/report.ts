import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/cleaning_volume/ReportHeader';

const serviceUrl = 'cleaning_volume';
const reportUrl = 'cleaning_volume';
const serviceName = 'CleaningVolume';

const schemaMakers = {};

const renderers = {};

const reportProps: IReportProps = {
  title: 'Удельный объем уборки для ТС',
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
