import { isObject, isNullOrUndefined } from 'util';
import { EdcRequestReject } from './@types/EdcRequestReject';

export const makeDefaultDutyMission = (): EdcRequestReject => ({
  id: null,
  rejection_reason_id: null,
  rejection_reason_name: '',
});

export const getDefaultDutyMissionElement = (element?: Partial<EdcRequestReject>) => {
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
