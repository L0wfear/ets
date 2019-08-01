import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type WaybillsReportForm = {
  date_start: string;
  date_end: string;
  withFilter: boolean;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsWaybillIntervalPrint = {
  filter: OneRegistryData['list']['processed']['filterValues'],
};
export type DispatchPropsWaybillIntervalPrint = {
};
export type OwnWaybillIntervalPrintProps = {
  element: null,
  handleHide: OnFormHideType
  registryKey: string;
  page: string;
  path?: string;
};

export type PropsWaybillIntervalPrintWithForm = (
  StatePropsWaybillIntervalPrint
  & DispatchPropsWaybillIntervalPrint
  & OwnWaybillIntervalPrintProps
);

export type PropsWaybillIntervalPrint = OutputWithFormProps<
  PropsWaybillIntervalPrintWithForm,
  WaybillsReportForm,
  [ any ],
  WaybillsReportForm
>;
