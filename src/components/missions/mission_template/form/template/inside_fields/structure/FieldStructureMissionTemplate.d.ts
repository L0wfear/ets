import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { OneSessionStructure } from 'redux-main/reducers/modules/session/session.d';
import { DefaultSelectOption } from 'components/ui/input/ReactSelect/utils';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';

export type StateFieldStructureMissionTemplate = {
};

export type StatePropsFieldStructureMissionTemplate = {
};
export type DispatchPropsFieldStructureMissionTemplate = {
};

export type OwnPropsFieldStructureMissionTemplate = {
  value: number | void;
  name: string | void;
  disabled: boolean;
  error: string | void;
  onChange: (obj: { [key: string]: any }) => any;
  clearable: boolean;
  STRUCTURES: DefaultSelectOption<number, string, OneSessionStructure>[];
  page: string;
  path: string;

  car_ids: MissionTemplate['car_ids'];
};

export type PropsFieldStructureMissionTemplate = (
  StatePropsFieldStructureMissionTemplate
  & DispatchPropsFieldStructureMissionTemplate
  & OwnPropsFieldStructureMissionTemplate
);
