export const validators = [];

const fixedValidators = [
  {
    name: 'required',
    validator(config, data = '') {
      return config.required && !data ? `Поле "${config.title}" должно быть заполнено` : undefined;
    },
  },
  // {
  //   name: 'date',
  //   validator(config, data = '') {
  //     if (data === '') {
  //       return undefined;
  //     }
  //     const test = dateRegex.test(data);
  //
  //     if (!test) {
  //       return `Поле "${config.title}" должно быть датой в виде ГГГГ-ММ-ДД`;
  //     } else {
  //       const [, year, month, day] = dateRegex.exec(data).map((value) => parseInt(value, 10));
  //       const date = new Date(year, month - 1, day);
  //       return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day ? undefined : `Поле "${config.title}" должно быть датой в виде ГГГГ-ММ-ДД`;
  //     }
  //
  //   }
  // }
];

export function validate(config, data) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = fixedValidators
    .map(({ validator }) => validator(config, data))
    .filter(d => !!d)[0];

  return error;
}
