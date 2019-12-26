import { getRequiredFieldToFixed } from 'components/@next/@utils/getErrorString/getErrorString';

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && !data && data !== 0
        ? `Поле "${config.title || config.key}" должно быть заполнено`
        : undefined;
    },
  },
  {
    name: 'number',
    validator(config, data) {
      if (!data && data !== 0) {
        return undefined;
      }
      return typeof data !== 'number'
        && !/^[ +]?[0-9]*[\\.,]?[0-9]{1,3}$/.test(data)
        ? getRequiredFieldToFixed(config.title || config.key, 3)
        : undefined;
    },
  },
  {
    name: 'min',
    validator(config, data) {
      if (typeof config.min === 'undefined') {
        return undefined; 
      }
      return parseFloat(data) < config.min
        ? `Поле "${config.title || config.key}" должно быть не меньше ${
          config.min
        }`
        : undefined;
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
