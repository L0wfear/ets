import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import * as React from 'react';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/penalties/ReportHeader';
import PhotoLink from 'components/old/reports/operational/penalties/PhotoLink/PhotoLink';

const serviceUrl = 'report/penalties';
const reportUrl = 'penalties';
const serviceName = 'PenaltiesReport';

const schemaMakers: ISchemaMaker = {

};

const renderers = {
  photo_url: ({ data }) => data ? <PhotoLink data={data} /> : '-',
};

const reportProps: IReportProps = {
  title: 'Отчет по штрафам',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  enumerated: true,
  schemaMakers,
  useFiltersForPrint: true,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
