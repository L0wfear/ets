import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/consumable_material_usage_report/ReportHeader';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';
import EtsBootstrap from 'components/new/ui/@bootstrap';

const serviceUrl = 'consumable_material_usage_report';
const reportUrl = 'consumable-material-usage-report';
const serviceName = 'ConsumableMaterialUsageReport';

const displayNameConsumableMaterialMeasureUnitName = (schema) => (
  <React.Fragment>
    {schema.displayName}
    {' '}
    <EtsBootstrap.OverlayTrigger
      trigger={['hover', 'focus']}
      overlay={(
        <EtsBootstrap.Popover>
          {
            'Ед. изм. расходного материала'
          }
        </EtsBootstrap.Popover>
      )}
      placement="left"
    >
      <EtsBootstrap.Glyphicon glyph="info-sign"/>
    </EtsBootstrap.OverlayTrigger>
  </React.Fragment>
);

const schemaMakers: ISchemaMaker = {
  consumable_material_measure_unit_name: (schema) => ({
    ...schema,
    displayName: displayNameConsumableMaterialMeasureUnitName(schema),
  }),
};
const summarySchemaMakers: ISchemaMaker = {
  consumable_material_measure_unit_name: (schema) => ({
    ...schema,
    displayName: displayNameConsumableMaterialMeasureUnitName(schema),
  }),
};

const reportProps: IReportProps = {
  title: 'Отчет по использованию расходных материалов',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  enumeratedChildren: true,
  notUseServerSummerTable: true,
  tableProps: {
    reportKey: serviceUrl,
  },
  schemaMakers,
  summarySchemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
