import { FieldCommon } from 'components/@next/@form/@types/fields/common';

/**
 * Схема для типа valueOfArray
 * @param clearable - может ли быть пустым
 */
export type FieldValueOFArrayCommon<F, K extends keyof F> = FieldCommon<K> & {
  clearable?: boolean;
};
