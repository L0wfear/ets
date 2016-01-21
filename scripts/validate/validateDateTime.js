import _ from 'lodash';

const dateRegex = /^(\d{4})-(\d{2})-(\d{2}) $/;

export const validators = [];

const fixedValidators = [
  {
    name: 'required',
    validator(config, data) {
      return config.required && !data ? `Поле "${config.title}" должно быть заполнено` : void 0;
    }
  },
  // {
  //   name: 'date',
  //   validator(config, data = '') {
  //     if (data === '') {
  //       return void 0;
  //     }
  //     const test = dateRegex.test(data);
  //
  //     if (!test) {
  //       return `Поле "${config.title}" должно быть датой в виде ГГГГ-ММ-ДД`;
  //     } else {
  //       const [, year, month, day] = dateRegex.exec(data).map((value) => parseInt(value, 10));
  //       const date = new Date(year, month - 1, day);
  //       return date.getFullYear() === year && date.getMonth() + 1 === month && date.getDate() === day ? void 0 : `Поле "${config.title}" должно быть датой в виде ГГГГ-ММ-ДД`;
  //     }
  //
  //   }
  // }
];

export function validate(config, data) {
  //console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = _(fixedValidators)
    .map(({validator}) => validator(config, data))
    .filter()
    .first();

  return error;
}
