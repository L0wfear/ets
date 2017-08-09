export function getFullAccess(entity) {
  const OPERATIONS = ['list', 'create', 'read', 'update', 'delete'];

  return OPERATIONS.map(op => `${entity}.${op}`);
}

export const autobase: string[] = [
];
