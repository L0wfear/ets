import { HandleThunkActionCreator } from 'react-redux';
import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';
import autobaseActions from 'redux-main/reducers/modules/autobase/actions-autobase';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearch';

export type StatePropsNorm = {
};
export type DispatchPropsNorm = {
  actionGetWorkKind: HandleThunkActionCreator<typeof someUniqActions.actionGetWorkKind>;
  actionGetTechnicalOperationTypes: HandleThunkActionCreator<typeof someUniqActions.actionGetTechnicalOperationTypes>;
  actionGetSensorType: HandleThunkActionCreator<typeof someUniqActions.actionGetSensorType>;
  autobaseGetSetCarFuncTypes: HandleThunkActionCreator<typeof autobaseActions.autobaseGetSetCarFuncTypes>;
};
export type OwnNormProps = WithFormRegistrySearchAddProps<Norm>;

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
