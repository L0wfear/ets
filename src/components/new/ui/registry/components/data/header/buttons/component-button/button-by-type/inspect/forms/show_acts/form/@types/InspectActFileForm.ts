import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { InspectOneActScan } from 'redux-main/reducers/modules/inspect/act_scan/@types/inspect_act_scan';

export type OwnInspectActFileFormProps = {
  element: InspectOneActScan;
  handleHide: any;
  page: string;
  path?: string;
};

export type PropsInspectActFileFormWithForm = OwnInspectActFileFormProps;

export type PropsInspectActFileForm = OutputWithFormProps<
  PropsInspectActFileFormWithForm,
  any,
  [ any ],
  any
>;
