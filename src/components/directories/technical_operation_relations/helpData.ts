export const customOptionsTechnicalOperation = [
  {
    name: 'TECHNICAL_OPERATION_OPTIONS',
    fields: ['id', 'name', 'norm_ids'],
    callBack: data => data.reduce((TECHNICAL_OPERATION_OPTIONS, { id, name, norm_ids }) => {
      if (id && !TECHNICAL_OPERATION_OPTIONS.asObj[id]) {
        TECHNICAL_OPERATION_OPTIONS.asObj[id] = { id, name, norm_ids };
        TECHNICAL_OPERATION_OPTIONS.asArr.push({ value: id, label: name, norm_ids });
      }

      return TECHNICAL_OPERATION_OPTIONS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];

export const customOptionsMunicipalFacility = [
  {
    name: 'MUNICIPAL_FACILITY_OPTIONS',
    fields: ['municipal_facility_id', 'municipal_facility_name', 'normatives'],
    callBack: data => data.reduce((MUNICIPAL_FACILITY_OPTIONS, { municipal_facility_id, municipal_facility_name, normatives }) => {
      if (municipal_facility_id && !MUNICIPAL_FACILITY_OPTIONS.asObj[municipal_facility_id]) {
        MUNICIPAL_FACILITY_OPTIONS.asObj[municipal_facility_id] = { municipal_facility_id, municipal_facility_name, normatives };
        MUNICIPAL_FACILITY_OPTIONS.asArr.push({ value: municipal_facility_id, label: municipal_facility_name, normatives });
      }

      return MUNICIPAL_FACILITY_OPTIONS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];

export const customOptionsFuncType = [
  {
    name: 'FUNC_TYPE_OPTIONS',
    fields: ['car_func_types'],
    callBack: data => data.reduce((FUNC_TYPE_OPTIONS, { car_func_types }) => {
      car_func_types.forEach(({ asuods_id, name, short_name }) => {
        if (asuods_id && !FUNC_TYPE_OPTIONS.asObj[asuods_id]) {
          FUNC_TYPE_OPTIONS.asObj[asuods_id] = { asuods_id, name, short_name };
          FUNC_TYPE_OPTIONS.asArr.push({ value: asuods_id, label: name || short_name });
        }
      });

      return FUNC_TYPE_OPTIONS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];
