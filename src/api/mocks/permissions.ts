function getFullAccess(entity) {
  const OPERATIONS = ['list', 'create', 'read', 'update', 'delete'];

  return OPERATIONS.map(op => `${entity}.${op}`);
}

export const autobase: string[] = [
  // ...getFullAccess('battery'),
  // ...getFullAccess('battery_brand'),
  // ...getFullAccess('battery_manufacturer'),
  // ...getFullAccess('tire'),
  // ...getFullAccess('spare_part'),
  ...getFullAccess('autobase_tech_maintenance_order'),
  ...getFullAccess('autobase_tech_inspection'),
  ...getFullAccess('autobase_insurance_policy_registry'),
  ...getFullAccess('autobase_tech_maintenance_registry'),
  ...getFullAccess('autobase_repair_registry'),
  ...getFullAccess('autobase_long_tech_maintenance'),
  ...getFullAccess('autobase_road_accident_registry'),
  ...getFullAccess('autobase_repair_company'),
];
