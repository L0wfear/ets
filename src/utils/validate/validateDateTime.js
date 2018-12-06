export const validators = [];

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && !data ? `Поле "${config.title}" должно быть заполнено` : undefined;
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
