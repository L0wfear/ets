import { Waybill } from 'redux-main/reducers/modules/waybill/@types';

/**
 * Получение текста шапки формы ПЛ
 */
export const getTitleByStatus = (IS_CREATING: boolean, IS_DRAFT: boolean, IS_ACTIVE: boolean, IS_CLOSED: boolean, number: Waybill['number']) => {
  if (IS_ACTIVE) {
    return `Активный путевой лист № ${number}`;
  }
  if (IS_CREATING) {
    return 'Создать новый путевой лист';
  }
  if (IS_DRAFT) {
    return 'Создание нового путевого листа (возможна корректировка)';
  }
  if (IS_CLOSED) {
    return `Просмотр путевого листа № ${number}`;
  }
};
