export const waybill_types = {
  waybill_print: 'waybill_print',
} as const;

export const waybill_types_reverse = Object.entries(waybill_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
