import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { OneRegistryData } from 'components/new/ui/registry/module/registry';

export type WaybillPrintJournalForm = {
  month: number;
  year: number;
  formationPeriod: 'month' | 'day';
  date: string;
};

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsWaybillByDatePrint = {
  filter: OneRegistryData['list']['processed']['filterValues'],
};
export type DispatchPropsWaybillByDatePrint = {
};
export type OwnWaybillByDatePrintProps = {
  element: null,
  handleHide: OnFormHideType
  registryKey: string;
  page: string;
  path?: string;
};

export type PropsWaybillByDatePrintWithForm = (
  StatePropsWaybillByDatePrint
  & DispatchPropsWaybillByDatePrint
  & OwnWaybillByDatePrintProps
);

export type PropsWaybillByDatePrint = OutputWithFormProps<
  PropsWaybillByDatePrintWithForm,
  WaybillPrintJournalForm,
  [ any ],
  any
>;
