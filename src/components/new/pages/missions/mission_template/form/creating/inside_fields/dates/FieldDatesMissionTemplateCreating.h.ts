import {
  PropsMissionTemplateCreatingForm,
  MissionTemplateCreating,
} from '../../@types/MissionTemplateCreatingForm';

export type StateFieldDatesMissionTemplateCreating = {
};

export type StatePropsFieldDatesMissionTemplateCreating = {
};
export type DispatchPropsFieldDatesMissionTemplateCreating = {
};

export type OwnPropsFieldDatesMissionTemplateCreating = {
  isPermitted: boolean;
  date_start: MissionTemplateCreating['date_start'];
  error_date_start: string,
  date_end: MissionTemplateCreating['date_end'];
  error_date_end: string,

  onChange: PropsMissionTemplateCreatingForm['handleChange'];

  missionTemplates: MissionTemplateCreating['missionTemplates'];

  disabled: boolean;
  page: string;
  path: string;
};

export type PropsFieldDatesMissionTemplateCreating = (
  StatePropsFieldDatesMissionTemplateCreating
  & DispatchPropsFieldDatesMissionTemplateCreating
  & OwnPropsFieldDatesMissionTemplateCreating
);
