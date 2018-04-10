import { ISchemaRenderer, ISchemaMaker } from 'components/ui/table/@types/schema.h';

export interface IReportProps {
  title: string | JSX.Element | null;
  serviceName: string;
  serviceUrl: string;
  reportUrl: string;
  tableProps?: any;
  enumerated?: boolean;
  initialSort?: boolean;
  enableSort?: boolean;
  headerComponent: any;
  renderers?: ISchemaRenderer;
  summaryRenderes?: ISchemaRenderer;
  schemaMakers?: ISchemaMaker;
  useServerFilter?: boolean;
  headerStateMaker?(state: any): any;
}
