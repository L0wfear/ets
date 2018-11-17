export const customOptionsTableFromMainResult = [
  {
    name: 'ELEMENTS',
    fields: ['elements'],
    callBack: (data) => data.reduce((ELEMENTS, { elements: [{ id, name }] }) => {
      if (id && !ELEMENTS.asObj[id]) {
        ELEMENTS.asObj[id] = name;
        ELEMENTS.asArr.push({ value: name, label: name });
      }

      return ELEMENTS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
  {
    name: 'KIND_TASK_NAMES',
    fields: ['kind_task_names'],
    callBack: (data) => data.reduce((KIND_TASK_NAMES, { kind_task_names }) => {
      kind_task_names.forEach((name) => {
        if (name && !KIND_TASK_NAMES.asObj[name]) {
          KIND_TASK_NAMES.asObj[name] = name;
          KIND_TASK_NAMES.asArr.push({ value: name, label: name });
        }
      });

      return KIND_TASK_NAMES;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];

export const customOptionsTableFromTypes = [
  {
    name: 'CAR_TYPES',
    fields: ['asuods_id', 'short_name'],
    callBack: (data) => data.reduce((CAR_TYPES, { asuods_id, short_name }) => {
      if (asuods_id && !CAR_TYPES.asObj[asuods_id]) {
        CAR_TYPES.asObj[asuods_id] = short_name;
        CAR_TYPES.asArr.push({ value: short_name, label: short_name });
      }

      return CAR_TYPES;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];

export const customOptionsTableFromSensorTypes = [
  {
    name: 'SENSORS_TYPE_OPTIONS',
    fields: ['id', 'name'],
    callBack: (data) => data.reduce((SENSORS_TYPE_OPTIONS, { id, name }) => {
      if (id && !SENSORS_TYPE_OPTIONS.asObj[id]) {
        SENSORS_TYPE_OPTIONS.asObj[id] = name;
        SENSORS_TYPE_OPTIONS.asArr.push({ value: id, label: name });
      }

      return SENSORS_TYPE_OPTIONS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];
