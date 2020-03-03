import {
  InitialStateSession,
} from 'redux-main/reducers/modules/session/@types/session';
import {
  getSessionStructuresParams,
  getSessionStructuresOptions,
} from 'redux-main/reducers/modules/session/selectors';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

export type StateFieldStructureDutyMission = {};

export type StatePropsFieldStructureDutyMission = {
  STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
} & ReturnType<typeof getSessionStructuresParams>;

export type DispatchPropsFieldStructureDutyMission = {};

export type OwnPropsFieldStructureDutyMission = {
  value: InitialStateSession['userData']['structure_id'];
  name: InitialStateSession['userData']['structure_name'];
  error: string;
  disabled: boolean;
  isPermitted: boolean;
  onChange: (
    obj: Pick<
      InitialStateSession['userData'],
      'structure_id' | 'structure_name'
    >,
  ) => void;

  page: string;
  path: string;

  formDataKey?: FormKeys;
};

export type PropsFieldStructureDutyMission = StatePropsFieldStructureDutyMission &
  DispatchPropsFieldStructureDutyMission &
  OwnPropsFieldStructureDutyMission;
