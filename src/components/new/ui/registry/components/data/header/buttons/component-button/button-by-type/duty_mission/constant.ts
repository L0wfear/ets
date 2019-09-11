export const duty_mission_types = {
  duty_missions_remove: 'duty_missions_remove',
  duty_missions_export: 'duty_missions_export',
  duty_missions_complete: 'duty_missions_complete',
  duty_missions_fail: 'duty_missions_fail',
  duty_missions_to_archvie: 'duty_missions_to_archvie',
  duty_missions_from_archvie: 'duty_missions_from_archvie',
} as const;

export const duty_mission_types_reverse = Object.entries(duty_mission_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
