const fixedValidators = [
  {
    name: 'required',
    validator(config, value) {
      return config.required && !value && value !== 0
        ? `Поле "${config.title || config.key}" должно быть заполнено`
        : undefined;
    },
  },
  {
    name: 'number',
    validator(config, value) {
      if (!value && value !== 0) {
        return undefined;
      }
      let error = '';
      if (config.float) {
        if (typeof value === 'number') {
          error = undefined;
        } else {
          // old
          const regexp = new RegExp(
            `^[+]?[0-9]*[\\.|,][0-9]{${config.float + 1},}$`,
          );
          error = regexp.test(value)
            ? `Поле "${config.title
                || config.key}" должно быть неотрицательным числом с ${
              config.float
            } знаками после запятой`
            : undefined;
        }
      }
      if (config.integer) {
        const regexp = new RegExp('^\\d+$');
        error
          = error
          || (typeof value !== 'number' && !regexp.test(value)
            ? `Поле "${config.title
                || config.key}" должно быть целочисленным, неотрицательным`
            : undefined);
      }
      error
        = error
        || (typeof value !== 'number' && isNaN(value)
          ? `Поле "${config.title || config.key}" должно быть числом`
          : undefined);
      return error;
    },
  },
  {
    name: 'min',
    validator(config, value) {
      const parsedValue = Number(value);
      if (typeof config.min === 'undefined' || isNaN(parsedValue))
        return undefined;
      return parsedValue < config.min
        ? config.alt_min && config.max
          ? `Поле "${config.title
              || config.key}" должно быть неотрицательным числом и меньше ${
            config.max
          }`
          : `Поле "${config.title || config.key}" должно быть не меньше ${
            config.min
          }`
        : undefined;
    },
  },
  {
    name: 'max',
    validator(config, value) {
      const parsedValue = parseInt(value, 10);
      if (typeof config.max === 'undefined' || isNaN(parsedValue))
        return undefined;
      return parsedValue >= config.max
        ? config.alt_min && config.max
          ? `Поле "${config.title
              || config.key}" должно быть неотрицательным числом и меньше ${
            config.max
          }`
          : `Поле "${config.title || config.key}" должно быть не больше ${
            config.min
          }`
        : undefined;
    },
  },
  {
    name: 'maxLength',
    validator(config, value) {
      if (typeof config.maxLength === 'undefined') return undefined;
      return String(value).length > config.maxLength
        ? `Поле "${config.title || config.key}" должно содержать не больше ${
          config.maxLength
        } символов`
        : undefined;
    },
  },
  {
    name: 'minLength',
    validator(config, value) {
      if (typeof config.maxLength === 'undefined') return undefined;
      return String(value).length < config.minLength
        ? `Поле "${config.title || config.key}" должно содержать не меньше ${
          config.minLength
        } символов`
        : undefined;
    },
  },
  {
    name: 'equalLength',
    validator(config, value) {
      if (typeof config.equalLength === 'undefined') return undefined;
      const stringPresent = String(value);
      return stringPresent.length < config.equalLength
        || stringPresent.length > config.equalLength
        ? `Количество символов поля "${config.title
            || config.key}" должно быть равно ${config.equalLength}`
        : undefined;
    },
  },
];

export function validate(config, value, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = fixedValidators
    .map(({ validator }) => validator(config, value, data))
    .filter((d) => !!d)[0];

  return config.validation === false ? undefined : error;
}
