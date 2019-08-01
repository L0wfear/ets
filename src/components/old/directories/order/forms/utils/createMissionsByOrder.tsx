import * as React from 'react';
import { groupBy, cloneDeep, get } from 'lodash';
import { ASSING_BY_KEY } from './constant';
import IntervalPicker from 'components/old/ui/input/IntervalPicker';
import { getToday9am, getTomorrow9am } from 'utils/dates';

export const createMissions = async (flux, element, payload) => {
  let error = false;
  try {
    await flux.getActions('missions').createMissions(element, payload);
    return false;
  } catch ({ error_text: e }) {
    error = true;
    const code = get(e, 'message.code', null);

    if (code === 'no_active_waybill') {
      let cancel = false;
      try {
        await global.confirmDialog({
          title: 'Для ТС не существует активного ПЛ',
          body: 'Создать черновик ПЛ?',
        });
      } catch (err) {
        cancel = true;
      }
      if (!cancel) {
        const newPayload = {
          mission_source_id: payload.mission_source_id,
          passes_count: payload.passes_count,
          date_start: payload.date_start,
          date_end: payload.date_end,
          assign_to_waybill: 'assign_to_new_draft',
        };
        await createMissions(flux, element, newPayload);
      }
    }
    if (code === 'invalid_period') {
      const waybillNumber = e.message.message.split('№')[1].split(' ')[0];

      const body = (self) => (
        <div>
          <div>{e.message.message}</div>
          <br />
          <p>Введите даты задания:</p>
          <IntervalPicker
            interval={self.state.interval}
            onChange={(interval) => self.setState({ interval })}
          />
        </div>
      );

      let cancel = false;
      let state;
      try {
        state = await global.confirmDialog({
          title: <b>{`Задание будет добавлено в ПЛ №${waybillNumber}`}</b>,
          body,
          checkOnOk: (self) => {
            const {
              state: { interval },
            } = self;
            if (!interval || interval.some((date) => !date)) {
              global.NOTIFICATION_SYSTEM.notify(
                'Поля дат задания должны быть заполнены',
                'warning',
              );
              return false;
            }
            return true;
          },
        });
      } catch (err) {
        cancel = true;
      }
      if (!cancel) {
        const { interval = [getToday9am(), getTomorrow9am()] } = state;

        const newPayload = {
          mission_source_id: payload.mission_source_id,
          passes_count: payload.passes_count,
          date_start: interval[0],
          date_end: interval[1],
          assign_to_waybill: payload.assign_to_waybill,
        };

        await createMissions(flux, element, newPayload);
      }
    }
  }
  return error;
};

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
