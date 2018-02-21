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
      return typeof data !== 'string' ? `Поле ${config.title || config.key} должно быть строкой` : undefined;
    },
  },
  {
    name: 'trimSpace',
    validator(config, data) {
      if (typeof data !== 'string') {
        return undefined;
      }
      if (data.trim() !== data) {
        return `Поле "${config.title || config.key}" не должно начинаться и закачиваться пробелом`;
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
    .filter(d => !!d)[0];
  return error;
}
