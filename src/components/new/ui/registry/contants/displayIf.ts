export const displayIfContant = {
  isKgh: 'isKgh', // у пользователя есть права common.nsi_okrug_company_columns_show (Общее - Показывать колонку округа и организации в НСИ)
  isOkrug: 'isOkrug', // если указан округ у пользака, в админке, окружной пользователь
  lenghtStructureMoreOne: 'lenghtStructureMoreOne',
  false: false,
} as const;

export type TypeOneDisplayIf = typeof displayIfContant[keyof typeof displayIfContant];
