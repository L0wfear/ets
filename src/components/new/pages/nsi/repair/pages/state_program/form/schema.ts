import { SchemaType } from 'components/ui/form/new/@types/validate.h';
import { PropsStateProgram } from './@types/StateProgramForm';
import { StateProgram } from 'redux-main/reducers/modules/repair/state_program/@types/stateProgram';

export const stateProgramFormSchema: SchemaType<StateProgram, PropsStateProgram> = {
  properties: {
    name: {
      title: 'Наименование государственной программы',
      type: 'string',
      required: true,
    },
    status_id: {
      title: 'Статус',
      type: 'valueOfArray',
      required: true,
    },
  },
};
