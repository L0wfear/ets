import { withProps } from 'recompose';

import { IReportProps } from 'components/old/reports/@types/common.h';
import { ISchemaMaker } from 'components/old/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/old/reports/common/ReportContainer';
import ReportHeader from 'components/old/reports/operational/long_repair/ReportHeader';
import { makeDateFormated } from 'components/@next/@utils/dates/dates';

const serviceUrl = 'autobase/reports/long_repair';
const reportUrl = 'long-repair';
const serviceName = 'LongRepair';

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

const renderers = {
  fact_date_start: ({ data }) => makeDateFormated(data),
  fact_date_end: ({ data }) => makeDateFormated(data),
  plan_date_start: ({ data }) => makeDateFormated(data),
  plan_date_end: ({ data }) => makeDateFormated(data),
};

const reportProps: IReportProps = {
  title:
    'Отчет по транспортным средствам, простаивающим длительное время в ремонтной зоне',
  serviceName,
  reportUrl,
  serviceUrl,
  headerComponent: ReportHeader,
  renderers,
  summaryRenderes: renderers,
  enumerated: true,
  schemaMakers,
};

const ExportableReportContainer = exportable({
  entity: serviceUrl,
})(ReportContainer);

export default withProps(reportProps)(ExportableReportContainer);
