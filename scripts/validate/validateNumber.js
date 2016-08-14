import _ from 'lodash';

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && !data && data !== 0 ? `Поле "${config.title || config.key}" должно быть заполнено` : void 0;
    }
  },
  {
    name: 'number',
    validator(config, data) {
      if (!data && data !== 0) {
        return void 0;
      }
      return typeof data !== 'number' && !/^[-  +]?[0-9]*\.?\,?[0-9]{1,3}$/.test(data) ? `Поле ${config.title || config.key} должно быть числом` : void 0;
    }
  },
  {
    name: 'min',
    validator(config, data) {
      if (typeof config.min === 'undefined') return void 0;
      return data < config.min ? `Поле "${config.title || config.key}" должно быть не меньше ${config.min}` : void 0;
    }
  },
  {
    name: 'max',
    validator(config, data) {
      if (typeof config.max === 'undefined') return void 0;
      return data > config.max ? `Поле "${config.title || config.key}" должно быть не больше ${config.max}` : void 0;
    }
  },
];

export function validate(config, data) {
  //console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({validator}) => validator(config, data))
    .filter()
    .first();

  return error;
}
