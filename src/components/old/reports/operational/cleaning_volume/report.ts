import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/cleaning_volume/ReportHeader';

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
