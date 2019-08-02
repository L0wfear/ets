import { Cleaning } from 'api/missions';
import { createValidDate } from 'components/@next/@utils/dates/dates';

export const loadCleaningMunicipalFacilityList = (outerPyload) => {
  const payload = {
    ...outerPyload,
    start_date: createValidDate(outerPyload.start_date),
    end_date: createValidDate(outerPyload.end_date),
  };

  if (!payload.kind_task_ids) {
    delete payload.kind_task_ids;
  }

  return (
    Cleaning.path('municipal_facility')
    .get(payload)
    .then(({ result: { rows } }) => ({
      municipal_facility_list: rows,
    }))
    .catch((error) => {
      // tslint:disable-next-line
      console.warn(error);

      return {
        municipal_facility_list: [],
      };
    })
  );
};
