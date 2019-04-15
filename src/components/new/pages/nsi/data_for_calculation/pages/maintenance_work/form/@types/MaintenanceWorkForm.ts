import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { MaintenanceWork } from 'redux-main/reducers/modules/maintenance_work/@types/maintenanceWork';
import { HandleThunkActionCreator } from 'react-redux';
import { actionLoadMeasureUnit } from 'redux-main/reducers/modules/some_uniq/measure_unit/actions';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsMaintenanceWorkFormLazy = {
  element: Partial<MaintenanceWork>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsMaintenanceWork = {};
export type DispatchPropsMaintenanceWork = {
  actionLoadMeasureUnit: HandleThunkActionCreator<typeof actionLoadMeasureUnit>;
};
export type OwnMaintenanceWorkProps = {
  element: Partial<MaintenanceWork>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsMaintenanceWorkWithForm = (
  StatePropsMaintenanceWork
  & DispatchPropsMaintenanceWork
  & OwnMaintenanceWorkProps
);

export type PropsMaintenanceWork = OutputWithFormProps<
  PropsMaintenanceWorkWithForm,
  MaintenanceWork,
  [ MaintenanceWork ],
  any
>;
