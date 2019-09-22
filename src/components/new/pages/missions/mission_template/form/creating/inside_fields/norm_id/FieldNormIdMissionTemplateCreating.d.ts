import { HandleThunkActionCreator } from 'react-redux';
import {
  PropsMissionTemplateCreatingForm,
  MissionTemplateCreating,
} from '../../@types/MissionTemplateCreatingForm';
import someUniqActions from 'redux-main/reducers/modules/some_uniq/actions';

export type StateFieldNormIdMissionTemplateCreating = {
};

export type StatePropsFieldNormIdMissionTemplateCreating = {
};
export type DispatchPropsFieldNormIdMissionTemplateCreating = {
  actionLoadCleaningOneNorm: HandleThunkActionCreator<
    typeof someUniqActions.actionLoadCleaningOneNorm
  >;
};

export type OwnPropsFieldNormIdMissionTemplateCreating = {
  date_start: MissionTemplateCreating['date_start'];
  missionTemplates: MissionTemplateCreating['missionTemplates'];
  onChange: PropsMissionTemplateCreatingForm['handleChange'];

  page: string;
  path: string;
};

export type PropsFieldNormIdMissionTemplateCreating = StatePropsFieldNormIdMissionTemplateCreating &
  DispatchPropsFieldNormIdMissionTemplateCreating &
  OwnPropsFieldNormIdMissionTemplateCreating;
