import { Actions } from 'flummox';

import {
  createValidDate,
  createValidDateTime,
} from 'components/@next/@utils/dates/dates';
import { Repair, ObjectProperty } from 'api/Services';
import REPAIR from 'constants/repair';

const parsePutPath = (entity, method, formState) => `${entity}/${method === 'put' ? formState.id : ''}`;

export default class RepairActions extends Actions {
  async getRepairListByType(type, data, other) {
    const trueType = REPAIR[type];
    const payload = {
      ...data,
    };

    const response = await Repair.path(trueType).get(payload);

    return {
      type,
      data: response,
      ...other,
    };
  }

  async getObjectProperty(data, other) {
    const payload = {
      ...data,
    };

    const response = await ObjectProperty.get(payload);

    return {
      type: 'objectProperty',
      data: response,
      ...other,
    };
  }

  getDataAboutObjectById(id) {
    const { progress } = REPAIR;
    const payload = {
      object_id: id,
    };

    return Repair.path(progress).get(payload);
  }

  getObjectVersions(id) {
    const { objects } = REPAIR;

    return Repair.path(`${objects}/${id}/program_versions`)
      .get({})
      .then(({ result: { rows } }) => rows);
  }

  cleartDataAboutObjectById() {
    return new Promise((res) => res({ resolve: { rows: [] } }));
  }

  postDataToUpdateObjectPercent(formState) {
    const { progress } = REPAIR;
    const payload = {
      ...formState,
      reviewed_at: createValidDateTime(formState.reviewed_at),
    };

    return Repair.path(progress).post(payload, false, 'json');
  }

  removePercent(id) {
    const { progress } = REPAIR;

    return Repair.path(`${progress}/${id}`).delete({}, false, 'json');
  }

  async getAllVersionsById(id) {
    const { programVersion } = REPAIR;
    const payload = {
      program_id: id,
    };

    const response = await Repair.path(`${programVersion}`).get(
      payload,
    );

    return response;
  }

  // DITETS-1795
  contractor(method, formState) {
    const payload = {
      ...formState,
    };
    const { contractor } = REPAIR;

    const path = parsePutPath(contractor, method, formState);

    return Repair.path(path)[method](
      payload,
      this.getRepairListByType.bind(null, 'contractor'),
      'json',
    );
  }

  // DITETS-1033
  async programRegistryPost(formState) {
    const payload = {
      ...formState,
    };
    [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ].forEach((key) => {
      if (payload[key]) {
        payload[key] = createValidDate(payload[key]);
      }
    });
    const { programRegistry } = REPAIR;

    const path = parsePutPath(programRegistry, 'post', formState);
    const ans = await Repair.path(path).post(payload, false, 'json');
    // Для обновления таблицы
    // Не в callback, потому что нужен новый id, а не весь список
    this.getRepairListByType('programRegistry', {}, {});
    return ans;
  }

  programVersionPut(formState) {
    const { programVersion } = REPAIR;
    const payload = {
      ...formState,
    };
    [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ].forEach((key) => {
      if (payload[key]) {
        payload[key] = createValidDate(payload[key]);
      }
    });

    const path = parsePutPath(programVersion, 'put', payload);
    return Repair.path(path).put(payload, false, 'json');
  }

  programVersionPutOnlyFiles(formState) {
    const { programVersion } = REPAIR;
    const payload = {
      files: [...formState.files],
    };

    const path = parsePutPath(programVersion, 'put', formState);
    return Repair.path(path).patch(payload, false, 'json');
  }

  programVersionCreateVersion(formState) {
    const payload = {
      ...formState,
    };
    [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ].forEach((key) => {
      if (payload[key]) {
        payload[key] = createValidDate(payload[key]);
      }
    });
    const { programVersion } = REPAIR;

    const path = parsePutPath(programVersion, 'post', formState);
    return Repair.path(path).post(payload, false, 'json');
  }

  programVersionSendToReview(formState) {
    return this.programVersionSendFor('send_to_review', formState, true);
  }

  programVersionSendToApply(formState) {
    return this.programVersionSendFor('accept', formState);
  }

  programVersionSendToCansel(formState) {
    return this.programVersionSendFor('reject', formState);
  }

  programVersionSendToClose(formState) {
    return this.programVersionSendFor('close', formState);
  }

  programVersionSendFor(type, formState, withForm = false) {
    const { programVersion } = REPAIR;
    const payload = {
      ...formState,
    };

    [
      'plan_date_start',
      'plan_date_end',
      'fact_date_start',
      'fact_date_end',
    ].forEach((key) => {
      if (payload[key]) {
        payload[key] = createValidDate(payload[key]);
      }
    });

    const path = parsePutPath(programVersion, 'put', formState);
    return Repair.path(`${path}/${type}`).put(
      withForm || type === 'close' ? payload : {},
      false,
      'json',
    );
  }

  /* DITETS-2014 */
  programRemark(method, formState) {
    const payload = {
      ...formState,
    };
    const { programRemark } = REPAIR;
    const { program_version_id } = formState;

    const path = parsePutPath(programRemark, method, formState);

    return Repair.path(path)[method](
      payload,
      this.getRepairListByType.bind(null, 'programRemarkRegistry', {
        program_version_id,
      }),
      'json',
    );
  }

  removeProgramRemark(id) {
    const { programRemark } = REPAIR;

    return Repair.path(`${programRemark}/${id}`).delete({}, false, 'json');
  }

  rejectRemarks(id) {
    const { programRemark } = REPAIR;

    return Repair.path(`${programRemark}/${id}/reject`).put({}, false, 'json');
  }

  fixRemarks(id) {
    const { programRemark } = REPAIR;

    return Repair.path(`${programRemark}/${id}/fix`).put({}, false, 'json');
  }

  /* DITETS-2388 */
  programObject(method, formState) {
    const payload = {
      ...formState,
      plan_date_start: createValidDateTime(formState.plan_date_start),
      plan_date_end: createValidDateTime(formState.plan_date_end),
      fact_date_start: createValidDateTime(formState.fact_date_start),
      fact_date_end: createValidDateTime(formState.fact_date_end),
    };
    delete payload.object_list;
    delete payload.draw_object_list;

    const { objects } = REPAIR;
    const { program_version_id } = formState;

    const path = parsePutPath(objects, method, formState);

    return Repair.path(path)[method](
      payload,
      this.getRepairListByType.bind(null, 'objects', { program_version_id }),
      'json',
    );
  }

  removeProgramObject(id) {
    const { objects } = REPAIR;

    return Repair.path(`${objects}/${id}`).delete({}, false, 'json');
  }
}
