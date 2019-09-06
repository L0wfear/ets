/**
 * Дефолтное значение для всех типов полей
 * @param title - label поля
 * @param required - обязательно для заполнения или нет
 */
export type FieldCommon<K> = {
  key: K;
  title: string;
  required?: boolean,

  md?: number;
};
