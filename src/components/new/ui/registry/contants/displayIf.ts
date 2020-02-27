export const displayIfContant = {
  isKgh: 'isKgh', // у пользователя есть права common.nsi_company_column_show (Общее - Показывать колонку организации в НСИ)
  isOkrug: 'isOkrug', // если указан округ у пользака, в админке, окружной пользователь
  lenghtStructureMoreOne: 'lenghtStructureMoreOne',
  false: false,
} as const;

export type TypeOneDisplayIf = typeof displayIfContant[keyof typeof displayIfContant];
