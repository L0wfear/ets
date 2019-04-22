export const mission_types = {
  missions_remove: 'missions_remove',
  missions_export: 'missions_export',
  mission_create: 'mission_create',
  mission_create_by_order: 'mission_create_by_order',
  missions_complete: 'missions_complete',
  missions_to_archvie: 'missions_to_archvie',
  missions_from_archvie: 'missions_from_archvie',
};

export const mission_types_reverse = Object.entries(mission_types).reduce(
  (newObj, [key, value]) => {
    newObj[value] = key;

    return newObj;
  },
  {},
);
