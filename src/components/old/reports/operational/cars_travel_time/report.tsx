import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/cars_travel_time/ReportHeader';

import {
  TriggerDate,
} from 'components/reports/operational/cars_travel_time/triggerDate';

const serviceUrl = 'cars_travel_time';
const reportUrl = 'cars_travel_time';
const serviceName = 'CarsTravelTimeReportNew';

const schemaMakers = {
  carpool_events: (schema) => ({
    ...schema,
    filter: false,
  }),
};

const renderers = {
  carpool_events: ({ data }) => {
    if (data.length) {
      return data.map(
        (elem) => (
          <TriggerDate
            events = {elem.events}
            date = {elem.date}
          >
          </TriggerDate>),
        );
    } else {
      return '-';
    }
  },
};

const reportProps: IReportProps = {
  title: 'Время движения ТС по заданиям',
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
