export const customOptionsTableFromMainResult = [
  {
    name: 'GOV_NUMBERS',
    fields: ['gov_number'],
    callBack: (data) => data.reduce((GOV_NUMBERS, { gov_number }) => {
      if (gov_number && !GOV_NUMBERS.asObj[gov_number]) {
        GOV_NUMBERS.asObj[gov_number] = gov_number;
        GOV_NUMBERS.asArr.push({ value: gov_number, label: gov_number });
      }

      return GOV_NUMBERS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
  {
    name: 'GARAGE_NUMBERS',
    fields: ['garage_number'],
    callBack: (data) => data.reduce((GARAGE_NUMBERS, { garage_number }) => {
      if (garage_number && !GARAGE_NUMBERS.asObj[garage_number]) {
        GARAGE_NUMBERS.asObj[garage_number] = garage_number;
        GARAGE_NUMBERS.asArr.push({ value: garage_number, label: garage_number });
      }

      return GARAGE_NUMBERS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
  {
    name: 'DRIVER_FIOS',
    fields: ['driver_fio'],
    callBack: (data) => data.reduce((DRIVER_FIOS, { driver_fio }) => {
      if (driver_fio && !DRIVER_FIOS.asObj[driver_fio]) {
        DRIVER_FIOS.asObj[driver_fio] = driver_fio;
        DRIVER_FIOS.asArr.push({ value: driver_fio, label: driver_fio });
      }

      return DRIVER_FIOS;
    }, { asObj: {}, asArr: [] }),
    optionsPath: ['asArr'],
  },
];
