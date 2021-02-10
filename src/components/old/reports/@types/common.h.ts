import { ISchemaRenderer, ISchemaMaker, IDataTableColSchema } from 'components/old/ui/table/@types/schema.h';

export type IReportProps = {
  title: string | JSX.Element | null;
  titleText?: string;
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
  summarySchemaMakers?: ISchemaMaker;
  additionalSchemaMakers?: Array<IDataTableColSchema>;
  notUseServerSummerTable?: boolean;
  headerStateMaker?(state: any): any;
  onRowDoubleClick?: any;
  notUseServerSummerTableForPrint?: boolean;
};
