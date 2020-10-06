import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import * as React from 'react';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/penalties/ReportHeader';

const serviceUrl = 'report/penalties';
const reportUrl = 'penalties';
const serviceName = 'PenaltiesReport';

const schemaMakers: ISchemaMaker = {

};

const renderers = {
  photo_url: ({ data }) => data ? <a target="_blank" href={data}>Просмотр</a> : '-',
};

const reportProps: IReportProps = {
  title: 'Штрафы',
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
