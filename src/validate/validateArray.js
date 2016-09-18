import _ from 'lodash';

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && (!data || (data && !data.length)) ? `Поле "${config.title || config.key}" должно быть заполнено` : undefined;
    },
  },
  // {
  //   name: 'array',
  //   validator(config, data) {
  //     if (!data || (data && !data.length)) {
  //       return undefined;
  //     }
  //     return typeof data !== 'string' ? `Поле ${config.title || config.key} должно быть заполнено` : undefined;
  //   }
  // }
];

export function validate(config, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({ validator }) => validator(config, data))
    .filter()
    .first();

  return error;
}
