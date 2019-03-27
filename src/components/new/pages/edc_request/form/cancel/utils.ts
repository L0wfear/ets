import { isObject, isNullOrUndefined } from 'util';
import { EdcRequestCancel } from './@types/EdcRequestCancel';

export const makeDefaultDutyMission = (): EdcRequestCancel => ({
  id: null,
  cancel_reason_id: null,
  cancel_reason_name: '',
});

export const getDefaultDutyMissionElement = (element?: Partial<EdcRequestCancel>) => {
  const newElement = makeDefaultDutyMission();
  if (isObject(element)) {
    Object.keys(newElement).forEach((key) => {
      if (!isNullOrUndefined(element[key])) {
        newElement[key] = element[key];
      }
    });
  }

  return newElement;
};
