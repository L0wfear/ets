export const displayIfContant = {
  isKgh: 'isKgh',
  isOkrug: 'isOkrug',
  lenghtStructureMoreOne: 'lenghtStructureMoreOne',
  false: false,
} as const;

export type TypeOneDisplayIf = typeof displayIfContant[keyof typeof displayIfContant];
