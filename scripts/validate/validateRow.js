import _ from 'lodash';

// import * as string from './validateString';
// import * as text from './validateText';
import * as number from './validateNumber.js';
import * as floatFixed3 from './validateFloatFixed3.js';
import * as datetime from './validateDateTime.js';
import * as string from './validateString.js';
import * as array from './validateArray.js';
// import * as date from './validateDate.js';
// import * as integer from './validateInteger';
// import * as bool from './validateBool';
// import * as reference from './validateReference';
// import * as file from './validateFile';
// import * as list from './validateList';
// import * as computable from './validateComputable.js';
// import * as object from './validateObject';
// import * as geodata from './validateGeodata';

const validators = {
  //string,
  //text,
  number,
  datetime,
  floatFixed3,
  string,
  array,
  // date,
  // integer,
  // bool,
  // reference,
  // file,
  // list,
  // object,
  // computable,
  // geodata,
};

function validateRowByType(config, value, references) {
  const { type } = config;
  const validator = validators[type];

  return validator ? validator.validate(config, value, references) : void 0;
}

export function validateRow(config, value, references) {


  //console.warn(`VALIDATING ${config.key} with data = ${value}`);

  let error = validateRowByType(config, value, references);

  // if (!error && rowConfig.extends) {
  //   error = validateRowByType(rowConfig.extends, rowConfig, value, references);
  // }

  // if (!error && rowConfig.config.customValidations) {
  //   return _(rowConfig.config.customValidations)
  //     .map(({expression, message}) => eval(expression) ? message : void 0)
  //     .filter()
  //     .first();
  // }

  return error;
}
