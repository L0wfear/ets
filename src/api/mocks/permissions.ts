export function getFullAccess(entity) {
  const OPERATIONS = ['list', 'create', 'read', 'update', 'delete'];

  return OPERATIONS.map(op => `${entity}.${op}`);
}

export const autobase: string[] = [
];

export const repair: string[] = [
  ...getFullAccess('repair_state_program'),
  ...getFullAccess('repair_contractor'),
  ...getFullAccess('repair_program_registry'),
];

export const userNotification: string[] = [
  ...getFullAccess('userNotification'),
];
