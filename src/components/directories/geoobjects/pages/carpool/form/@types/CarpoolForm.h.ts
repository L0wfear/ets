import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { Carpool, UpdateCarpool, CreateCarpool } from 'redux-main/reducers/modules/geoobject/actions_by_type/carpool/@types';
import { IDataTableSchema } from 'components/ui/table/@types/schema.h';

export type OnFormHideType = (isSubmited: boolean, result?: any) => void;

export type PropsCarpoolFormWrap = {
  selectField: string;
  loadingPageName?: string;
  page?: string;
  onFormHide: any;
  refreshList?: any;
  path?: string;
  meta: IDataTableSchema;
  entity: string;
} & (
  {
    showForm: false,
    element: null,
  }
  | {
    showForm: true,
    element: Carpool,
  }
);

export type StatePropsCarpool = {};
export type DispatchPropsCarpool = {
  createAction: CreateCarpool;
  updateAction: UpdateCarpool;
};
export type OwnCarpoolProps = {
  element: Carpool | null;
  handleHide: OnFormHideType;
  meta: IDataTableSchema;
  entity: string;
  page?: string;
  path?: string;
  refreshList: any;
};

export type PropsCarpoolWithForm = (
  StatePropsCarpool
  & DispatchPropsCarpool
  & OwnCarpoolProps
);

export type PropsCarpool = OutputWithFormProps<
  PropsCarpoolWithForm,
  Carpool,
  [ Carpool ],
  any
>;
export type StateCarpool = {
};
