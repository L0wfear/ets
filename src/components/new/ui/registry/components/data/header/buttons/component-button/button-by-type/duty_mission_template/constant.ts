export const duty_mission_template_types = {
  duty_missions_by_templates: 'duty_missions_by_templates',
};

export const duty_mission_template_types_reverse = Object.entries(duty_mission_template_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
