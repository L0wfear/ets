import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';
import { WithFormRegistrySearchAddProps } from 'components/old/compositions/vokinda-hoc/formWrap/withFormRegistrySearchNew';

export type PropsStateProgramWithForm = WithFormRegistrySearchAddProps<StateProgram>;

export type PropsStateProgram = OutputWithFormProps<
  PropsStateProgramWithForm,
  StateProgram,
  [ StateProgram ],
  any
>;
