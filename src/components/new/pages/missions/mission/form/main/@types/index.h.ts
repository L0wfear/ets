import { HandleThunkActionCreator } from 'react-redux';

import { Mission } from 'redux-main/reducers/modules/missions/mission/@types';
import { getSessionStructuresParams } from 'redux-main/reducers/modules/session/selectors';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { IStateSomeUniq } from 'redux-main/reducers/modules/some_uniq/@types/some_uniq.h';
import { IStateMissions } from 'redux-main/reducers/modules/missions/@types/missions.h';
import { GetMapImageInBase64ByKeyType } from 'components/new/ui/map/context/MapetsContext.h';
import { FormKeys } from 'redux-main/reducers/modules/form_data_record/@types/form_data_record';

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
    IS_CREATING: boolean;
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
    submitAction: (assign_to_waybill: string[]) => Promise<any>;

    formDataKey: FormKeys & 'mission';  // ключ к стору
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
