function getFullAccess(entity) {
  const OPERATIONS = ['list', 'create', 'read', 'update', 'delete'];

  return OPERATIONS.map(op => `${entity}.${op}`);
}

export const autobase: string[] = [
  ...getFullAccess('battery_registry'),
  ...getFullAccess('battery_brand'),
  ...getFullAccess('battery_manufacturer'),
  ...getFullAccess('tire_registry'),
  ...getFullAccess('spare_part'),
];
