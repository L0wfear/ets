export const inspect_types = {
  inspect_show_acts: 'inspect_show_acts',
};

export const inspect_types_reverse = Object.entries(inspect_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
