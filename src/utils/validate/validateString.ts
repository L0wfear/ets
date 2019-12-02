import { getNoTrimSpaceMessage } from "components/@next/@utils/getErrorString/getErrorString";

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && (!data || (data && !data.length)) ? `Поле "${config.title || config.key}" должно быть заполнено` : undefined;
    },
  },
  {
    name: 'string',
    validator(config, data) {
      if (!data || (data && !data.length)) {
        return undefined;
      }
      if (typeof data !== 'string') {
        return `Поле ${config.title || config.key} должно быть строкой`;
      }
      if (data.length !== data.trim().length) {
        return `Поле ${config.title || config.key} не должно начинаться и заканчиваться пробелом`;
      }
      return undefined;
    },
  },
  {
    name: 'trimSpace',
    validator(config, data) {
      if (typeof data !== 'string') {
        return undefined;
      }
      if (data.trim() !== data) {
        return getNoTrimSpaceMessage(config.title || config.key);
      }

      return undefined;
    },
  },
  {
    name: 'length',
    validator(config, data) {
      if (typeof data !== 'string') {
        return undefined;
      }

      if (data.length < config.minLength) {
        return `Длина поля должна быть больше минимального количества символов (${config.minLength})`;
      }

      if (data.length > config.maxLength) {
        return `Длина поля не должна превышать максимальное количество символов (${config.maxLength})`;
      }

      return undefined;
    },
  },
];

export function validate(config, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = fixedValidators
    .map(({ validator }) => validator(config, data))
    .filter((d) => !!d)[0];
  return error;
}
