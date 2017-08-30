import moment from 'moment';
import { isEmpty } from 'utils/functions';

const fixedValidators = [
  {
    name: 'gt',
    validator(config, value, dependentFieldConfig, dependentFieldValue) {
      const MUST_BE_GREATER_THAN = `"${config.title || config.key}" должно быть больше "${dependentFieldConfig.title}"`;
      if (isEmpty(value) || isEmpty(dependentFieldValue)) {
        return;
      }
      if (config.type === 'date' || config.type === 'datetime') {
        if (moment(value).toDate().getTime() <= moment(dependentFieldValue).toDate().getTime()) {
          return MUST_BE_GREATER_THAN;
        }
      }
      return +value <= +dependentFieldValue ? MUST_BE_GREATER_THAN : undefined;
    },
  },
];

function validate(config, value, dependentFieldConfig, dependentFieldValue, formData, schema) {
  // console.warn(`VALIDATING ${config.key} with data = ${data}`);
  const error = fixedValidators
    .map(({ validator }) => validator(config, value, dependentFieldConfig, dependentFieldValue, formData, schema))
    .filter(d => !!d)[0];

  return error;
}

export default {
  validate,
};
