import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Efficiency } from 'redux-main/reducers/modules/efficiency/@types/efficiency';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsEfficiencyFormLazy = {
  element: Partial<Efficiency>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsEfficiency = {};
export type DispatchPropsEfficiency = {
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnEfficiencyProps = {
  element: Partial<Efficiency>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsEfficiencyWithForm = (
  StatePropsEfficiency
  & DispatchPropsEfficiency
  & OwnEfficiencyProps
);

export type PropsEfficiency = OutputWithFormProps<
  PropsEfficiencyWithForm,
  Efficiency,
  [ Efficiency ],
  any
>;
