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
export const userNotification: string[] = [
  ...getFullAccess('userNotification'),
  ...getFullAccess('program_remark_registry'),
];
