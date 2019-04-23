import { createMissions } from 'components/missions/mission_template/MissionTemplateFormWrap';
import { createDutyMissions } from 'components/missions/duty_mission_template/DutyMissionTemplateFormWrap';
import { groupBy } from 'lodash';
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

export const createDutyMissionByOrder = async (flux, missionsArr, mission_source_id, faxogramm_id) => {
  const ansArr = await missionsArr.map(async (mission) => {
    const { id } = mission;

    const {
      date_from: date_start,
      date_to: date_end,
    } = mission as any;

    const externalPayload = {
      mission_source_id,
      date_start,
      date_end,
    };
    const newElement = {
      ...mission,
      faxogramm_id,
    };

    try {
      await createDutyMissions(flux, { [id]: newElement }, externalPayload);
      return true;
    } catch (e) {
      return false;
    }
  });

  return !ansArr.some((ans: boolean) => !ans);
};
