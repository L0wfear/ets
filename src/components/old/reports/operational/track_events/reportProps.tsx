import * as React from 'react';

import { IReportProps } from 'components/old/reports/@types/common.h';

import ReportHeader from 'components/old/reports/operational/track_events/ReportHeader';
import EtsBootstrap from 'components/new/ui/@bootstrap';

export const serviceUrl = 'track_events';
const reportUrl = 'track-events-reports';
const serviceName = 'TrackEventsReportService';

const schemaMakers = {
  coords_msk: (schema) => ({
    ...schema,
    cssClassName: 'map-view',
  }),
  event_value: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
};

export const renderers = (handleMapVisibility) => ({
  okrug_name: ({ data }) => data || '-',
  district_name: ({ data }) => data || '-',
  coords_msk: (meta) => (
    <div>
      <span onClick={(event) => handleMapVisibility(meta.data, event)}>
        <EtsBootstrap.Glyphicon glyph="info-sign" />
      </span>
    </div>
  ),
});

const reportProps: IReportProps = {
  title: 'Отчет по возможным сливам топлива',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  enumerated: true,
  schemaMakers,
};

export default reportProps;
