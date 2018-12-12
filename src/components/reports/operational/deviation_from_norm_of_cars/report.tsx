import { withProps } from 'recompose';

import { IReportProps } from 'components/reports/@types/common.h';
import { ISchemaMaker, IDataTableColSchema } from 'components/ui/table/@types/schema.h';

import { exportable } from 'utils/decorators';
import ReportContainer from 'components/reports/common/ReportContainer';
import ReportHeader from 'components/reports/operational/deviation_from_norm_of_cars/ReportHeader';

const serviceUrl = 'deviation_from_norm_of_cars';
const reportUrl = 'deviation-from-norm-of-cars';
const serviceName = 'DeviationFromNormOfCars';

const schemaMakers: ISchemaMaker = {
  a: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-numbe',
    },
  }),
  b: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-numbe',
    },
  }),
  c: (schema) => ({
    ...schema,
    filter: {
      type: 'advanced-numbe',
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
