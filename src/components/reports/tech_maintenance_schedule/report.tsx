import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';
import { ISchemaRenderer, ISchemaMaker } from 'components/ui/table/@types/schema.h';

import DateFormatter from 'components/ui/DateFormatter';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from './ReportHeader';

const serviceUrl = 'tech_maintenance_schedule';
const reportUrl = 'tech-maintenance-schedule';
const serviceName = 'TechMaintenanceSchedule';

const schemaMakers: ISchemaMaker = {
  latest_tech_maintenance_date: schema => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
};

const renderers: ISchemaRenderer = {
  latest_tech_maintenance_date: ({ data }) => <DateFormatter date={data} time={false} />,
};

const reportProps: IReportProps = {
  title: 'График проведения технического обслуживания транспортных средств',
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
