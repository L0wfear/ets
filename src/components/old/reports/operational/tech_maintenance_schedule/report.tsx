import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaRenderer, ISchemaMaker } from 'components/old/ui/table/@types/schema.h';

import DateFormatter from 'components/old/ui/DateFormatter';
import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/tech_maintenance_schedule/ReportHeader';

const serviceUrl = 'autobase/reports/tech_maintenance_schedule';
const reportUrl = 'tech-maintenance-schedule';
const serviceName = 'TechMaintenanceSchedule';

const schemaMakers: ISchemaMaker = {
  latest_tech_maintenance_date: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
  next_tech_maintenance_odometer_left: (schema) => ({
    ...schema,
    type: 'number',
  }),
  next_tech_maintenance_motohours_left: (schema) => ({
    ...schema,
    type: 'number',
  }),
};

const renderers: ISchemaRenderer = {
  latest_tech_maintenance_date: ({ data }) => <DateFormatter date={data} time={false} />,
};
const tableProps = {
  initialSort: 'next_tech_maintenance_odometer_left',
  initialSortAscending: true,
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
  tableProps,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
