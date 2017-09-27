const OPERATIONS = {
  L: 'list',
  C: 'create',
  R: 'read',
  U: 'update',
  D: 'delete',
  REW: 'review',
};

export function getFullAccess(entity, permission = ['L', 'C', 'R', 'U', 'D']) {

  return permission.map(op => `${entity}.${OPERATIONS[op]}`);
}

export const autobase: string[] = [
];

export const repair: string[] = [
];

export const userNotification: string[] = [
  ...getFullAccess('userNotification'),
];
