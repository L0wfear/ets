import * as React from 'react';
import { withProps } from 'recompose';
import * as moment from 'moment';

import { IReportProps } from 'components/reports/@types/common.h';
import { ISchemaMaker, IDataTableColSchema } from 'components/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/long_repair/ReportHeader';
import DateFormatter from 'components/ui/DateFormatter';

const serviceUrl = 'autobase/reports/long_repair';
const reportUrl = 'long-repair';
const serviceName = 'LongRepair';

const testEndRepairWithLongTime20 = (lineData) => {
  const {
    fact_date_start,
    fact_date_end,
  } = lineData;

  const ansTest = moment(fact_date_end).diff(moment(fact_date_start), 'days') > 20;

  return ansTest;
};

const testEndRepairWithFactMorePlan = (lineData) => {
  const {
    fact_date_start,
    fact_date_end,
    plan_date_start,
    plan_date_end,
  } = lineData;

  const factDiff = moment(fact_date_end).diff(moment(fact_date_start), 'minutes');
  const planDiff = moment(plan_date_end).diff(moment(plan_date_start), 'minutes');

  const ansTest = factDiff > planDiff;

  return ansTest;
};

const testEndRepairWithLongTime20NotEndFact = (lineData) => {
  const {
    fact_date_start,
    fact_date_end,
  } = lineData;

  if (fact_date_end) {
    return false;
  }

  const ansTest = moment().diff(moment(fact_date_start), 'days') > 20;

  return ansTest;
};

const testEndRepairWithFactMorePlanNotEndFact = (lineData) => {
  const {
    fact_date_start,
    fact_date_end,
    plan_date_start,
    plan_date_end,
  } = lineData;

  if (fact_date_end) {
    return false;
  }

  const factDiff = moment().diff(moment(fact_date_start), 'minutes');
  const planDiff = moment(plan_date_end).diff(moment(plan_date_start), 'minutes');

  const ansTest = factDiff > planDiff;

  return ansTest;
};

const schemaMakers: ISchemaMaker = {
  fact_date_start: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
  fact_date_end: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
  plan_date_start: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
  plan_date_end: (schema) => ({
    ...schema,
    filter: {
      type: 'date',
    },
  }),
};

const additionalSchemaMakers: IDataTableColSchema[] = [
  {
    name: 'additionalFilter#1',
    displayName: 'Тип ремонта',
    display: false,
    filter: {
      type: 'select',
      filterFunction(value, lineData) {
        switch (value) {
          case 1: return true;
          case 2: return testEndRepairWithLongTime20(lineData);
          case 3: return testEndRepairWithFactMorePlan(lineData);
          case 4: return testEndRepairWithLongTime20NotEndFact(lineData);
          case 5: return testEndRepairWithFactMorePlanNotEndFact(lineData);
          default: return true;
        }
     },
     options: [
       { value: 1, label: 'Все типы'},
       { value: 2, label: 'Ремонт завершен, длительность ремонта более 20 дней'},
       { value: 3, label: 'Ремонт завершен, фактическая длительность больше плановой'},
       { value: 4, label: 'Ремонт не завершен, длительность ремонта более 20 дней'},
       { value: 5, label: 'Ремонт не завершен, фактическая длительность больше плановой'},
      ],
    },
  },
];

const renderers = {
  fact_date_start: ({ data }) => <DateFormatter date={data} />,
  fact_date_end: ({ data }) => <DateFormatter date={data} />,
  plan_date_start: ({ data }) => <DateFormatter date={data} />,
  plan_date_end: ({ data }) => <DateFormatter date={data} />,
};

const tableProps = {
  filterValues: {
    'additionalFilter#1': 1,
  },
};

const reportProps: IReportProps = {
  title: 'Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  enumerated: true,
  schemaMakers,
  additionalSchemaMakers,
  tableProps,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
