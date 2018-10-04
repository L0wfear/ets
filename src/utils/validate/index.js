import { validateField } from './validateField';

export function getRequiredFieldMessage(field = 'Название по умолчанию') {
  return `Поле "${field}" должно быть заполнено`;
}

export default {
  validateField,
};
