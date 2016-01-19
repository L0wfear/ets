import _ from 'lodash';

// const waybillMeta = [
//   {
//
//   },
//   {
//
//   },
//   {
//
//   },
//
// ]

const fixedValidators = [
  // {
  //   name: 'required',
  //   validator(config, data) {
  //     return config.required && !data && data !== 0 ? `Поле "${config.title}" должно быть заполнено` : void 0;
  //   }
  // },
  {
    name: 'number',
    validator(field, data) {
      //console.log(field, data);
      if (!data && data !== 0) {
        return void 0;
      }
      return typeof data !== 'number' && !/^[-  +]?[0-9]*\.?\,?[0-9]{1,3}$/.test(data) ? `Поле должно быть числом` : void 0;
    }
  }
];

export function validate(rowConfig, rowData) {
  const error = _(fixedValidators)
    .map(({validator}) => validator(rowConfig, rowData))
    .filter()
    .first();

  return error;
}
