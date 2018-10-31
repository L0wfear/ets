import {
  find,
} from 'lodash';

import * as number from './validateNumber';
import * as floatFixed3 from './validateFloatFixed3';
import * as datetime from './validateDateTime';
import * as string from './validateString';
import * as array from './validateArray';
import * as date from './validateDate';
import dependencyValidators from './dependency';

const validators = {
  number,
  datetime,
  floatFixed3,
  string,
  text: string,
  array,
  date,
};

function validateFieldByType(config, value, formData, componentProps) {
  const { type } = config;
  const validator = validators[type];

  return validator ? validator.validate(config, value, formData, componentProps) : undefined;
}

function validateFieldByDependencyType(type, config, value, dependentFieldConfig, dependentFieldValue, formData, schema, componentProps) {
  if (typeof type === 'undefined') {
    return undefined;
  }
  const validator = dependencyValidators[type];

  return validator ? validator.validate(config, value, dependentFieldConfig, dependentFieldValue, formData, schema, componentProps) : undefined;
}

export function validateField(config, value, formData, schema, componentProps) {
  // console.warn(`VALIDATING ${config.key} with data = ${value}`);

  const error = validateFieldByType(config, value, formData, componentProps);

  // If field validation is ok, we should check if it has some dependencies on other fields
  if (!error && schema.dependencies && schema.dependencies[config.key]) {
    return schema.dependencies[config.key]
      .map((dependencyValidationConfig) => {
        const { type, field, validator } = dependencyValidationConfig;
        if (typeof validator === 'function') {
          return validator(value, formData, componentProps);
        }
        // If no field was specified we should abort validation
        // TODO check schema before validation to remove this block
        if (typeof field === 'undefined') {
          return undefined;
        }
        // We need to check dependent field to work on comparisons
        const dependentFieldConfig = find(schema.properties, object => object.key === field);
        if (typeof dependentFieldConfig === 'undefined') {
          throw new Error(`Dependent field "${field}" for key "${config.key}" was not found in schema`);
        }
        const dependentFieldValue = formData[field];
        const dependentFieldValidationError = validateFieldByType(dependentFieldConfig, dependentFieldValue, formData, componentProps);
        if (dependentFieldValidationError) {
          return `Для проверки поля ${config.title} необходимо правильное заполнение поля ${dependentFieldConfig.title}`;
        }
        return validateFieldByDependencyType(type, config, value, dependentFieldConfig, dependentFieldValue, formData, schema, componentProps);
      })
      .filter(d => !!d)[0];
  }

  return error;
}
