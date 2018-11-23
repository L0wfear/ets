import {
  loadCleaningMunicipalFacilityList,
} from 'redux-main/trash-actions/cleaning/promise/promise';

export const getCleaningMunicipalFacilityList: any = (type, outerPyload, { page, path }) => {
  return ({
    type,
    payload: loadCleaningMunicipalFacilityList(outerPyload),
    meta: {
      promise: true,
      page,
      path,
    },
  });
};
