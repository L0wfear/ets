import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';

export type WaybillPrintJournalForm = {
  month: number;
  year: number;
  formationPeriod: 'month' | 'day';
  date: string;
};

export type PropsWaybillByDatePrintWithForm = {
  element: null;
  handleHide: (isSubmitted: boolean, result?: any) => void;
  registryKey: string;
  page: string;
  path?: string;
};

export type PropsWaybillByDatePrint = OutputWithFormProps<
  PropsWaybillByDatePrintWithForm,
  WaybillPrintJournalForm,
  [ any ],
  any
>;
