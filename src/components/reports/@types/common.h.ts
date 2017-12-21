import { ISchemaRenderer, ISchemaMaker, IDataTableColSchema } from 'components/ui/table/@types/schema.h';
import { IFilterValues } from 'components/ui/table/@types/DataTable.h';

export interface IReportProps {
  title: string | JSX.Element | null;
  serviceName: string;
  serviceUrl: string;
  reportUrl: string;
  tableProps?: any;
  enumerated?: boolean;
  initialSort?: string | boolean;
  enableSort?: boolean;
  headerComponent: any;
  renderers?: ISchemaRenderer;
  summaryRenderes?: ISchemaRenderer;
  schemaMakers?: ISchemaMaker;
  filterValues?: IFilterValues;
  additionalSchemaMakers?: IDataTableColSchema[];
  headerStateMaker?(state: any): any;
}
