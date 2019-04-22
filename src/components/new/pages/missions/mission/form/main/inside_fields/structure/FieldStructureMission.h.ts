import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getSessionStructuresOptions, getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';

export type StateFieldStructureMission = {
};

export type StatePropsFieldStructureMission = (
  {
    STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  }
  & ReturnType<typeof getSessionStructuresParams>
);

export type DispatchPropsFieldStructureMission = {
};

export type OwnPropsFieldStructureMission = {
  value: Mission['structure_id'];
  name: Mission['structure_name'];
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;

  page: string;
  path: string;
};

export type PropsFieldStructureMission = (
  StatePropsFieldStructureMission
  & DispatchPropsFieldStructureMission
  & OwnPropsFieldStructureMission
);
