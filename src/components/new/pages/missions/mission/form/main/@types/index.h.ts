import { HandleThunkActionCreator } from 'react-redux';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { GetMapImageInBase64ByKeyType } from 'components/new/ui/map/context/MapetsContext.h';

export type StatePropsMission = {
  order_mission_source_id: IStateSomeUniq['missionSource']['order_mission_source_id'];
  edcRequest: IStateMissions['missionData']['edcRequest'];
  waybillData: IStateMissions['missionData']['waybillData'];
  dependeceOrder: IStateMissions['missionData']['dependeceOrder'];
  dependeceTechnicalOperation: IStateMissions['missionData']['dependeceTechnicalOperation'];
} & ReturnType<typeof getSessionStructuresParams>;

export type DispatchPropsMission = {
  actionPrintFormMission: HandleThunkActionCreator<typeof missionsActions.actionPrintFormMission>;
  actionLoadOrderAndTechnicalOperationByIdForMission: HandleThunkActionCreator<typeof missionsActions.actionLoadOrderAndTechnicalOperationByIdForMission>;
  actionLoadWaybillDataByIdForMission: HandleThunkActionCreator<typeof missionsActions.actionLoadWaybillDataByIdForMission>;
  loadEdcRequiedByIdForMission: HandleThunkActionCreator<typeof missionsActions.loadEdcRequiedByIdForMission>;
  actionReseSetDependenceMissionDataForMissionForm: HandleThunkActionCreator<typeof missionsActions.actionReseSetDependenceMissionDataForMissionForm>;
};

export type OwnMissionProps = (
  {
    originalFormState: Mission;
    formState: Mission;
    formErrors: Partial<Record<keyof Mission, string>>;
    updateFormErrors: () => any,
    canSave: boolean;
    isPermitted: boolean;
    page: string;
    path: string;
    handleHide: (isSubmitted: any, result?: Mission | Partial<Mission> | any) => any;
    hideWithoutChanges: (...arg: any[]) => any;
    handleChange: (obj: Partial<Mission>) => any;
    submitAction: (mission: Mission, assign_to_waybill: string[]) => Promise<any>;
  }
  & {
    notChangeCar?: boolean;
  }
);
export type PropsMissionForm = StatePropsMission &
  DispatchPropsMission &
  OwnMissionProps & {
    getMapImageInBase64ByKey: GetMapImageInBase64ByKeyType;
  };
