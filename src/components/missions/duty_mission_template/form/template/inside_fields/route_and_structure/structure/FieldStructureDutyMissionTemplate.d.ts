import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { OneSessionStructure } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { DutyMissionTemplate } from 'redux-main/reducers/modules/missions/duty_mission_template/@types/index.h';
import { getSessionStructuresParams, getSessionStructuresOptions } from 'redux-main/reducers/modules/session/selectors';

export type StateFieldStructureDutyMissionTemplate = {
};

export type StatePropsFieldStructureDutyMissionTemplate = (
  {
    STRUCTURES: ReturnType<typeof getSessionStructuresOptions>;
  }
  & ReturnType<typeof getSessionStructuresParams>
);

export type DispatchPropsFieldStructureDutyMissionTemplate = {
};

export type OwnPropsFieldStructureDutyMissionTemplate = {
  value: DutyMissionTemplate['structure_id'];
  name: DutyMissionTemplate['structure_name'];
  error: string | void;
  disabled: boolean;
  isPermitted: boolean;
  onChange: (obj: Partial<DutyMissionTemplate>) => void;

  page: string;
  path: string;
};

export type PropsFieldStructureDutyMissionTemplate = (
  StatePropsFieldStructureDutyMissionTemplate
  & DispatchPropsFieldStructureDutyMissionTemplate
  & OwnPropsFieldStructureDutyMissionTemplate
);
