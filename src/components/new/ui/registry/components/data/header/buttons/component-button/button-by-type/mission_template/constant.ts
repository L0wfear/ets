export const mission_template_types = {
  missions_by_templates: 'missions_by_templates',
};

export const mission_template_types_reverse = Object.entries(mission_template_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
