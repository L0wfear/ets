import { createMissions } from 'components/missions/mission_template/MissionsCreationFormWrap';
import { groupBy, cloneDeep } from 'lodash';
import { ASSING_BY_KEY } from './constant';

export const createMissionPromise = async (flux, mission, mission_source_id, assign_to_waybill, faxogramm_id, norm_id) => {
  const { id } = mission;

  const {
    date_from: date_start,
    date_to: date_end,
    passes_count,
  } = mission as any;

  const externalPayload = {
    mission_source_id,
    passes_count,
    date_start,
    date_end,
    norm_id,
    assign_to_waybill,
  };

  const newElement = {
    ...mission,
  };

  if (faxogramm_id) {
    newElement.faxogramm_id = faxogramm_id;
  }

  try {
    const hasError = await createMissions(flux, { [id]: newElement }, externalPayload);
    return !hasError;
  } catch (e) {
    return false;
  }
};

export const createMissionByOrder = async (flux, missionsArr, mission_source_id, assign_to_waybill, faxogramm_id, norm_id) => {
  let ansArr = [true];

  if (assign_to_waybill === ASSING_BY_KEY.assign_to_new_draft) {
    const missionByCar = groupBy(missionsArr, 'car_ids');

    ansArr = await Promise.all(
      Object.values(missionByCar).map(async ([firstMission, ...otherMissions]) => {
        const goodCreateFirstMission = await createMissionPromise(flux, firstMission, mission_source_id, assign_to_waybill, faxogramm_id, norm_id);

        if (goodCreateFirstMission) {
          return createMissionByOrder(flux, otherMissions, mission_source_id, ASSING_BY_KEY.assign_to_available_draft, faxogramm_id, norm_id);
        }
        return false;
      }),
    );

  } else {
    ansArr = await Promise.all<boolean>(
      missionsArr.map((mission) => (
        createMissionPromise(flux, mission, mission_source_id, assign_to_waybill, faxogramm_id, norm_id)
      )),
    );
  }
  return !ansArr.some((ans) => !ans);
};

export const getValidDutyMissionFromOrderTemplate = (missionOwn, mission_source_id, faxogramm_id) => {
  const mission = cloneDeep(missionOwn);

  mission.mission_source_id = mission_source_id;
  mission.faxogramm_id = faxogramm_id;
  mission.plan_date_start = mission.date_from;
  mission.plan_date_end = mission.date_to;
  mission.status = 'not_assigned';

  delete mission.date_from;
  delete mission.date_to;

  return mission;
};
