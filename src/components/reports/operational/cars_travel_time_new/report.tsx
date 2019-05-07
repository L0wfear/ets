import * as React from 'react';
import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/cars_travel_time_new/ReportHeader';

import {
  TriggerDate,
} from 'components/reports/operational/cars_travel_time_new/triggerDate';

const serviceUrl = 'cars_travel_time_new'; // <<< newReport
const reportUrl = 'cars_travel_time_new'; // <<< newReport
const serviceName = 'CarsTravelTimeReportNew'; // <<< newReport, !!! не забыть заменить в services

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
  title: 'Время движения ТС по заданиям(новый)', // <<< newReport
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

// сделать HOC, внутри сделать рендер этого компонента с добавлением окна, пробросить даблклик на строку

// декоратор написать для ReportContainer

export default withProps(reportProps)(ExportableReportContainer);
