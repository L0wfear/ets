// import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/consumable_material_usage_report/ReportHeader';

const serviceUrl = 'consumable_material_usage_report';
const reportUrl = 'consumable-material-usage-report';
const serviceName = 'ConsumableMaterialUsageReport';

const reportProps: IReportProps = {
  title: 'Отчет по использованию расходных материалов',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  notUseServerSummerTable: true,
  tableProps: {
    reportKey: serviceUrl,
  },
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
