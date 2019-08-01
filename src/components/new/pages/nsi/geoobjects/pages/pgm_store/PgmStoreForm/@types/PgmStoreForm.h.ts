import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { PgmStore } from 'redux-main/reducers/modules/geoobject/actions_by_type/pgm_store/@types';
import { InitialStateSession } from 'redux-main/reducers/modules/session/session.d';
import { DispatchProp } from 'react-redux';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsPgmStoreFormWrap = {
  showForm: boolean;
  element: PgmStore | null;
  onFormHide: OnFormHideType

  registryKey?: string;
  page: string;
  path?: string;
};

export type StatePropsPgmStoreForm = {
  userData: InitialStateSession['userData'];
};
export type DispatchPropsPgmStoreForm = DispatchProp;
export type OwnPropsPgmStoreForm = {
  element: PgmStore | null;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsPgmStoreFormWithForm = (
  StatePropsPgmStoreForm
  & DispatchPropsPgmStoreForm
  & OwnPropsPgmStoreForm
);

export type PropsPgmStoreForm = OutputWithFormProps<
  PropsPgmStoreFormWithForm,
  PgmStore,
  [ PgmStore ],
  any
>;
export type StatePgmStoreForm = {
};
