import { get } from 'lodash';
import { InspectContainer } from './@types/container';
import { InspectContainerService } from 'api/Services';
import { PgmStore } from '../../geoobject/actions_by_type/pgm_store/@types';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const promiseGetInspectContainer = async (inspection_id: PgmStore['id']) => {
  const reposnse = await InspectContainerService.get(
    {
      inspection_id,
    },
  );

  return get(reposnse, 'result.rows', []);
};

export const promiseCreateInspectContainer = async (inspectContainer: InspectContainer) => {
  const reposnse = await InspectContainerService.post(
    {
      ...inspectContainer,
    },
    false,
    'json',
  );

  return get(reposnse, 'result.rows.0', null);
};

export const promiseUpdateInspectContainer = async (inspectContainer: InspectContainer) => {
  const payloadActions = inspectContainer?.actions?.map(
    (elem) => ({
      ...elem,
      date_start: createValidDate(elem.date_start),
      date_end: createValidDate(elem.date_end),
    }));

  const payload = {
    ...inspectContainer,
    actions: [...payloadActions],
  };

  const reposnse = await InspectContainerService.path(inspectContainer.id).put(
    {
      ...payload,
    },
    false,
    'json',
  );

  return get(reposnse, 'result.rows.0', null);
};

export const promiseRemoveInspectContainer = async (inspection_id: PgmStore['id']) => {
  await InspectContainerService.path(inspection_id).delete(
    {},
    false,
    'json',
  );
  global.NOTIFICATION_SYSTEM.notify('Запись успешно удалена', 'success');
};
