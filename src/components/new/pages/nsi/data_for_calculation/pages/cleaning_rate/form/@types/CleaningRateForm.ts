import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { CleaningRate } from 'redux-main/reducers/modules/cleaning_rate/@types/cleaningRate';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { actionGetTechnicalOperationRegistry } from 'redux-main/reducers/modules/some_uniq/technical_operation_registry/actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsCleaningRateFormLazy = {
  element: Partial<CleaningRate>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsCleaningRate = {};
export type DispatchPropsCleaningRate = {
  actionGetTechnicalOperationRegistry: HandleThunkActionCreator<typeof actionGetTechnicalOperationRegistry>;
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnCleaningRateProps = {
  element: Partial<CleaningRate>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsCleaningRateWithForm = (
  StatePropsCleaningRate
  & DispatchPropsCleaningRate
  & OwnCleaningRateProps
);

export type PropsCleaningRate = OutputWithFormProps<
  PropsCleaningRateWithForm,
  CleaningRate,
  [ CleaningRate ],
  any
>;
