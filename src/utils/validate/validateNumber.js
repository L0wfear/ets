import _ from 'lodash';

const fixedValidators = [
  {
    name: 'required',
    validator(config, value, data) {
      if (config.required && config.required !== true) {
        if (data[config.required] == null) return undefined;
      }
      return config.required && !value && value !== 0 ? `Поле "${config.title || config.key}" должно быть заполнено` : undefined;
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
        const regexp = new RegExp(`^[ +]?[0-9]*\.?,?[0-9]{1,${config.float}}$`);
        error = typeof value !== 'number' && !regexp.test(value) ? `Поле ${config.title || config.key} должно быть неотрицательным числом с ${config.float} знаками после запятой` : undefined;
      }
      if (config.integer) {
        error = error || (typeof value !== 'number' && !/^\d+$/.test(value) ? `Поле ${config.title || config.key} должно быть целочисленным` : undefined);
      }
      error = error || (typeof value !== 'number' && isNaN(value) ? `Поле ${config.title || config.key} должно быть числом` : undefined);
      return error;
    },
  },
  {
    name: 'min',
    validator(config, value) {
      if (typeof config.min === 'undefined') return undefined;
      return value < config.min ? `Поле "${config.title || config.key}" должно быть не меньше ${config.min}` : undefined;
    },
  },
  {
    name: 'max',
    validator(config, value) {
      if (typeof config.max === 'undefined') return undefined;
      return value > config.max ? `Поле "${config.title || config.key}" должно быть не больше ${config.max}` : undefined;
    },
  },
];

export function validate(config, value, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({ validator }) => validator(config, value, data))
    .filter()
    .first();

  return error;
}
