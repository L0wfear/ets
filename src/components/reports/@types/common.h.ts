import { ISchemaRenderer, ISchemaMaker, IDataTableColSchema } from 'components/ui/table/@types/schema.h';

export interface IReportProps {
  title: string | JSX.Element | null;
  serviceName: string;
  serviceUrl: string;
  reportUrl: string;
  summaryTitle?: string;
  tableProps?: any;
  enumerated?: boolean;
  enumeratedChildren?: boolean;
  initialSort?: string | boolean;
  enableSort?: boolean;
  headerComponent: any;
  renderers?: ISchemaRenderer;
  summaryRenderes?: ISchemaRenderer;
  schemaMakers?: ISchemaMaker;
  additionalSchemaMakers?: IDataTableColSchema[];
  notUseServerSummerTable?: boolean;
  headerStateMaker?(state: any): any;
}
