import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Norm } from 'redux-main/reducers/modules/norm_registry/@types';
import { HandleThunkActionCreator } from 'react-redux';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsNormFormLazy = {
  showForm: boolean;
  element: Partial<Norm>;
  onFormHide: OnFormHideType

  loadingPageName?: string;
  page?: string;
  path?: string;
};

export type StatePropsNorm = {
};
export type DispatchPropsNorm = {
  actionGetWorkKind: HandleThunkActionCreator<typeof someUniqActions.actionGetWorkKind>;
  actionGetTechnicalOperationObjects: HandleThunkActionCreator<typeof someUniqActions.actionGetTechnicalOperationObjects>;
  actionGetTechnicalOperationTypes: HandleThunkActionCreator<typeof someUniqActions.actionGetTechnicalOperationTypes>;
  actionGetSensorType: HandleThunkActionCreator<typeof someUniqActions.actionGetSensorType>;
  autobaseGetSetCarFuncTypes: HandleThunkActionCreator<typeof autobaseActions.autobaseGetSetCarFuncTypes>;
};
export type OwnNormProps = {
  element: Partial<Norm>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsNormWithForm = (
  StatePropsNorm
  & DispatchPropsNorm
  & OwnNormProps
);

export type PropsNorm = OutputWithFormProps<
  PropsNormWithForm,
  Norm,
  [ Norm ],
  any
>;
