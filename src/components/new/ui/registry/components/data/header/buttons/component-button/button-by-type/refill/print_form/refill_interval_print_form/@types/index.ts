import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { OneRegistryData } from 'components/new/ui/registry/module/@types/registry';

export type RefillReportForm = {
  date_from: string;
  date_to: string;
  registryKey: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsRefillIntervalPrint = {
  filter: OneRegistryData['list']['processed']['filterValues'];
};
export type DispatchPropsRefillIntervalPrint = {
};
export type OwnRefillIntervalPrintProps = {
  element: null;
  handleHide: OnFormHideType;
  registryKey: string;
  page: string;
  path?: string;
};

export type PropsRefillIntervalPrintWithForm = (
  StatePropsRefillIntervalPrint
  & DispatchPropsRefillIntervalPrint
  & OwnRefillIntervalPrintProps
);

export type PropsRefillIntervalPrint = OutputWithFormProps<
  PropsRefillIntervalPrintWithForm,
  RefillReportForm,
  [ any ],
  RefillReportForm
>;
