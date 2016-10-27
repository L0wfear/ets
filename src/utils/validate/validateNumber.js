import _ from 'lodash';

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && !data && data !== 0 ? `Поле "${config.title || config.key}" должно быть заполнено` : undefined;
    },
  },
  {
    name: 'number',
    validator(config, data) {
      if (!data && data !== 0) {
        return undefined;
      }
      return typeof data !== 'number' && !/^[-  +]?[0-9]*\.?,?[0-9]{1,3}$/.test(data) ? `Поле ${config.title || config.key} должно быть числом` : undefined;
    },
  },
  {
    name: 'integer',
    validator(config, data) {
      if (!data && data !== 0) {
        return undefined;
      }
      return typeof data !== 'number' && !/^\d+$/.test(data) ? `Поле ${config.title || config.key} должно быть целочисленным` : undefined;
    },
  },
  {
    name: 'min',
    validator(config, data) {
      if (typeof config.min === 'undefined') return undefined;
      return data < config.min ? `Поле "${config.title || config.key}" должно быть не меньше ${config.min}` : undefined;
    },
  },
  {
    name: 'max',
    validator(config, data) {
      if (typeof config.max === 'undefined') return undefined;
      return data > config.max ? `Поле "${config.title || config.key}" должно быть не больше ${config.max}` : undefined;
    },
  },
];

export function validate(config, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({ validator }) => validator(config, data))
    .filter()
    .first();

  return error;
}
