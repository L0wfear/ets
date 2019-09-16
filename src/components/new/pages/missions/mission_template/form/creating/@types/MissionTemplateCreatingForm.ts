import { OutputWithFormProps } from 'components/old/compositions/vokinda-hoc/formWrap/withForm';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { HandleThunkActionCreator } from 'react-redux';
import { actionGetAndSetInStoreCarForMission } from 'redux-main/reducers/modules/missions/mission_template/actions';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';

export type MissionTemplateCreating = (
  {
    missionTemplates: Record<string, MissionTemplate>;
    assign_to_waybill: Record<string, string[]>
  } & Partial<
    Pick<
      Mission,
      'mission_source_id' | 'mission_source_name' | 'date_start' | 'date_end' | 'passes_count'
    >
  >
);

export type OnFormHideType = (isSubmitted: boolean, result?: any) => void;

export type StatePropsMissionTemplate = {
  carForMissionIndex: IStateMissions['missionData']['carsIndex'];
};

export type DispatchPropsMissionTemplate = {
  actionGetAndSetInStoreCarForMission: HandleThunkActionCreator<typeof actionGetAndSetInStoreCarForMission>;
  actionResetCarsMission: HandleThunkActionCreator<typeof missionsActions.actionResetCarsMission>;
};
export type OwnMissionTemplateProps = {
  element: Partial<MissionTemplateCreating>;
  handleHide: OnFormHideType;

  page: string;
  path?: string;
};

export type PropsMissionTemplateWithForm = (
  StatePropsMissionTemplate
  & DispatchPropsMissionTemplate
  & OwnMissionTemplateProps
);

export type PropsMissionTemplateCreatingForm = OutputWithFormProps<
  PropsMissionTemplateWithForm,
  MissionTemplateCreating,
  any,
  any
>;
export type StateMissionTemplate = {};
