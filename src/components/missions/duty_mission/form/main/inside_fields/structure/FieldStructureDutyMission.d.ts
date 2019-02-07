import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { OneSessionStructure } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { getSessionStructuresParams, getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';
import { DutyMission } from 'redux-main/reducers/modules/missions/duty_mission/@types';

export type StateFieldStructureDutyMission = {
};

export type StatePropsFieldStructureDutyMission = (
  {
    STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  }
  & ReturnType<typeof getSessionStructuresParams>
);

export type DispatchPropsFieldStructureDutyMission = {
};

export type OwnPropsFieldStructureDutyMission = {
  value: DutyMission['structure_id'];
  name: DutyMission['structure_name'];
  error: string | void;
  disabled: boolean;
  isPermitted: boolean;
  onChange: (obj: Partial<DutyMission>) => void;

  page: string;
  path: string;
};

export type PropsFieldStructureDutyMission = (
  StatePropsFieldStructureDutyMission
  & DispatchPropsFieldStructureDutyMission
  & OwnPropsFieldStructureDutyMission
);
