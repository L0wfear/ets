import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';
import { ISchemaMaker, IDataTableColSchema } from 'components/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/cars_count_deviation/ReportHeader';

const serviceUrl = 'cars_count_deviation';
const reportUrl = 'cars-count-deviation';
const serviceName = 'CarsCountDeviation';

const schemaMakers: ISchemaMaker = {
  deviation: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-number',
    },
  }),
};

const additionalSchemaMakers: IDataTableColSchema[] = [
];

const renderers = {
};

const tableProps = {
};

const reportProps: IReportProps = {
  title: 'Отклонение от нормативного количества ТС',
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
