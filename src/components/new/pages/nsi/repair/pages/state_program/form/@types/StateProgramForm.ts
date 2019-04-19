import { OutputWithFormProps } from 'components/compositions/vokinda-hoc/formWrap/withForm';
import { HandleThunkActionCreator } from 'react-redux';
import { WithSearchProps } from 'components/new/utils/hooks/hoc/withSearch';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';
import { actionLoadStateProgramStatus } from 'redux-main/reducers/modules/repair/state_program_status/actions_state_program_status';

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type PropsStateProgramFormLazy = {
  element: Partial<StateProgram>;
  onFormHide: OnFormHideType

  registryKey?: string;
  page?: string;
  path?: string;
} & WithSearchProps;

export type StatePropsStateProgram = {};
export type DispatchPropsStateProgram = {
  actionLoadStateProgramStatus: HandleThunkActionCreator<typeof actionLoadStateProgramStatus>;
};
export type OwnStateProgramProps = {
  element: Partial<StateProgram>;
  handleHide: OnFormHideType
  page: string;
  path?: string;
};

export type PropsStateProgramWithForm = (
  StatePropsStateProgram
  & DispatchPropsStateProgram
  & OwnStateProgramProps
);

export type PropsStateProgram = OutputWithFormProps<
  PropsStateProgramWithForm,
  StateProgram,
  [ StateProgram ],
  any
>;
