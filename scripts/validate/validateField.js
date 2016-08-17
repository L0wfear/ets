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
import dependencyValidators from './dependency';

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

function validateFieldByType(config, value, formData) {
  const { type } = config;
  const validator = validators[type];

  return validator ? validator.validate(config, value, formData) : void 0;
}

function validateFieldByDependencyType(type, config, value, dependentFieldConfig, dependentFieldValue, formData, schema) {
  if (typeof type === 'undefined') {
    return void 0;
  }
  const validator = dependencyValidators[type];

  return validator ? validator.validate(config, value, dependentFieldConfig, dependentFieldValue, formData, schema) : void 0;
}

export function validateField(config, value, formData, schema) {

  //console.warn(`VALIDATING ${config.key} with data = ${value}`);

  let error = validateFieldByType(config, value, formData);

  // if (!error && config.extends) {
  //   error = validateFieldByType(config.extends, config, value, formData);
  // }
  // Версия из gistek-forms
  // if (!error && config.config.customValidations) {
  //   return _(config.config.customValidations)
  //     .map(({expression, message}) => eval(expression) ? message : void 0)
  //     .filter()
  //     .first();
  // }

  // If field validation is ok, we should check if it has some dependencies on other fields
  if (!error && schema.dependencies && schema.dependencies[config.key]) {
    return _(schema.dependencies[config.key])
      .map((dependencyValidationConfig) => {
        const { type, field, validator } = dependencyValidationConfig;
        if (typeof validator === 'function') {
          return validator(value, formData);
        }
        // If no field was specified we should abort validation
        // TODO check schema before validation to remove this block
        if (typeof field === 'undefined') {
          return void 0;
        }
        // We need to check dependent field to work on comparisons
        const dependentFieldConfig = _.find(schema.properties, (object) => object.key === field);
        if (typeof dependentFieldConfig === 'undefined') {
          throw new Error(`Dependent field "${field}" for key "${config.key}" was not found in schema`);
        }
        const dependentFieldValue = formData[field];
        const dependentFieldValidationError = validateFieldByType(dependentFieldConfig, dependentFieldValue, formData);
        if (dependentFieldValidationError) {
          return `Для проверки поля ${config.title} необходимо правильное заполнение поля ${dependentFieldConfig.title}`;
        }
        return validateFieldByDependencyType(type, config, value, dependentFieldConfig, dependentFieldValue, formData, schema);
      })
      .filter()
      .first();
  }

  return error;
}
