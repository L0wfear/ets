import _ from 'lodash';

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && (!data || (data && !data.length)) ? `Поле "${config.title || config.key}" должно быть заполнено` : void 0;
    }
  },
  {
    name: 'string',
    validator(config, data) {
      if (!data || (data && !data.length)) {
        return void 0;
      }
      return typeof data !== 'string' ? `Поле ${config.title || config.key} должно быть строкой` : void 0;
    }
  }
];

export function validate(config, data) {
  //console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({validator}) => validator(config, data))
    .filter()
    .first();

  return error;
}
