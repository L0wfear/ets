import * as React from 'react';
import { isObject, isNullOrUndefined } from 'util';
import { MissionTemplateCreating } from './@types/MissionTemplateCreatingForm';
import { MissionTemplate } from 'redux-main/reducers/modules/missions/mission_template/@types/index.h';
import { routeTypesBySlug } from 'constants/route';
import { diffDates, addTime, getToday9am, getTomorrow9am } from 'utils/dates';
import { cloneDeep, get, groupBy } from 'lodash';
import { Car } from 'redux-main/reducers/modules/autobase/@types/autobase.h';
import { HandleThunkActionCreator } from 'react-redux';
import missionsActions from 'redux-main/reducers/modules/missions/actions';
import { LoadingMeta } from 'redux-main/_middleware/@types/ets_loading.h';
import IntervalPicker from 'components/old/ui/input/IntervalPicker';
import { getDefaultMissionElement } from '../../../mission/form/main/utils';

export const makeDefaultMissionTemplate = (): MissionTemplateCreating => {
  const defaultMission = getDefaultMissionElement(null);

  const defaultMissionTemplateCreating: MissionTemplateCreating = {
    mission_source_id: defaultMission.mission_source_id,
    mission_source_name: defaultMission.mission_source_name,
    date_start: defaultMission.date_start,
    date_end: defaultMission.date_end,
    passes_count: defaultMission.passes_count,
    missionTemplates: {},
    assign_to_waybill: {},
  };

  return defaultMissionTemplateCreating;
};

export const getDefaultMissionTemplateElement = (element: Partial<MissionTemplateCreating>): MissionTemplateCreating => {
  const newElement = makeDefaultMissionTemplate();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        if (key === 'missionTemplates') {
          newElement[key] = Object.entries(element[key]).reduce(
            (newObj, [keyMission, missionData]) => {
              newObj[keyMission] = {
                ...missionData,
                is_cleaning_norm: missionData.car_type_ids.map(() => false),
                norm_ids: missionData.car_type_ids.map(() => false),
              };

              return newObj;
            },
            {},
          );
        } else {
          newElement[key] = cloneDeep(element[key]);
        }
      }
    });
  }

  newElement.assign_to_waybill = Object.entries(newElement.missionTemplates).reduce(
    (newObj, [keyMission, missionData]) => {
      if (!newObj[keyMission]) {
        newObj[keyMission] = [];
      }
      missionData.car_type_ids.forEach(() => {
        newObj[keyMission].push('assign_to_new_draft');
      });

      return newObj;
    },
    {},
  );

  const checkOnTypeRouteData = checkMissionsByRouteType(
    Object.values(newElement.missionTemplates),
    {
      date_start: newElement.date_start,
      date_end: newElement.date_end,
    },
  );

  if (checkOnTypeRouteData.error) {
    newElement.date_end = addTime(
      newElement.date_start,
      checkOnTypeRouteData.time,
      'hours',
    );
  }

  return newElement;
};

export const checkMissionsByRouteType = (missionsArr: MissionTemplate[], { date_start, date_end }: Pick<MissionTemplateCreating, 'date_start' | 'date_end'>) => {
  let type = '';
  const missionList = missionsArr.filter(({ is_cleaning_norm }) => is_cleaning_norm.includes(true));
  const isDt = missionList.some(({ route_type }) => route_type === routeTypesBySlug.dt.key);

  if (!isDt) {
    if (missionList.some(({ route_type }) => route_type === routeTypesBySlug.odh.key)) {
      type = 'odh';
    }
  } else {
    type = 'dt';
  }

  if (type) {
    const {
      time,
      title,
    } = routeTypesBySlug[type];

    if (!date_end || diffDates(date_end, date_start, 'hours') > time || diffDates(date_end, date_start, 'hours') <= 0) {
      return {
        error: true,
        title,
        time,
      };
    }
  }

  return { error: false };
};

export const checkMissionsOnStructureIdCar = (missionsArr: MissionTemplate[], carsIndex: Record<string, Car>) => {
  const missionsWithStructureId = missionsArr.filter(({ structure_id }) => !!structure_id);

  if (missionsWithStructureId) {
    const notPermitedMissionsNumber = missionsWithStructureId.reduce((newArr, { structure_id, car_ids, number }) => {
      car_ids.forEach((car_id) => {
        const { company_structure_id: car_structure_id = null, is_common = false } = carsIndex[car_id] || {};

        if (!is_common && car_structure_id !== structure_id) {
          newArr.push(`<${number}>`);
        }
      });

      return newArr;
    }, []);

    if (notPermitedMissionsNumber.length) {
      return notPermitedMissionsNumber;
    }
  }

  return [];
};

type MissionTemplateWithAssign = (
  MissionTemplate
  & {
    assign_to_waybill: string[];
  }
);
export const makeMissionsByTemplate = (missionTemplates: Record<string, MissionTemplate>, assign_to_waybill: Record<string, string[]>): Record<string, MissionTemplateWithAssign[]> => {
  return groupBy(
    Object.entries(missionTemplates).map(([key, missionTemplateData]) => {
      return {
        ...missionTemplateData,
        assign_to_waybill: assign_to_waybill[key],
      };
    }),
    'car_ids',
  );
};

export const makePartialMission = (missionTemplate: MissionTemplateWithAssign, missionTemplateCreating: MissionTemplateCreating) => {
  return {
    ...missionTemplate,
    date_start: missionTemplateCreating.date_start,
    date_end: missionTemplateCreating.date_end,
    mission_source_id: missionTemplateCreating.mission_source_id,
    mission_source_name: missionTemplateCreating.mission_source_name,
    hidden: true,
  };
};

/**
 * Какое-то мясо
 */
export const createMissionByTemplate = async (
  actionCreateMission: HandleThunkActionCreator<typeof missionsActions.actionCreateMission>,
  element: any, // todo
  meta: LoadingMeta,
) => {
  let error = false;
  const {
    is_cleaning_norm,
    ...elementRaw
  } = element;

  try {
    await actionCreateMission(
      {
        ...getDefaultMissionElement(null),
        ...elementRaw,
      },
      element.assign_to_waybill,
      meta,
    );
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
        await createMissionByTemplate(
          actionCreateMission,
          {
            ...elementRaw,
            is_cleaning_norm,
            assign_to_waybill: elementRaw.assign_to_waybill.map(() => 'assign_to_new_draft'),
          },
          meta,
        );
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

        await createMissionByTemplate(
          actionCreateMission,
          {
            ...elementRaw,
            date_start: interval[0],
            date_end: interval[1],
          },
          meta,
        );
      }
    }
  }
  return error;
};
