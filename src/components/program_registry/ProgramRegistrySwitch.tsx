import * as React from 'react';
import { cloneDeep } from 'lodash';

import { isEmpty } from 'utils/functions';
import { validateField } from 'utils/validate/validateField.js';

import { formValidationSchema } from 'components/program_registry/schema';
import ProgramRegistryFormCreateWrap from 'components/program_registry/CreateForm/ProgramRegistryFormCWrap';
import ProgramRegistryFormUWrap from 'components/program_registry/UpdateFrom/ProgramRegistryFormUWrap';

const defSendFromState = ({ callback, outFormState }) => {
  const schema = formValidationSchema;
  const formState = Object.entries(outFormState).reduce((newFormState, [key, val]) => {
    if (typeof val === 'string') {
      return {
        ...newFormState,
        [key]: val.trim(),
      };
    }

    return { ...newFormState,  [key]: val };
  }, {});

  schema.properties.forEach(p => {
    if (p.type === 'number' && p.float) {
      formState[p.key] = !isNaN(formState[p.key]) && formState[p.key] !== null ? parseFloat(formState[p.key]) : null;
    }
    if (p.type === 'number' && p.integer) {
      const parsedValue = parseInt(formState[p.key], 10);
      formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
    }
  });

  return callback(formState);
};

const getFrowmStateAndErrorAndCanSave = (elementOld = null) => {
  let element = {};
  if (elementOld !== null) {
    element = cloneDeep(elementOld);
  } else {
    element = {};
  }
  const formErrors = validate(element, {});

  return {
    formState: element,
    formErrors,
    canSave: !Object.values(formErrors).some(value => !!value),
  };
};

const validate = (state, errors) => {
  const schema = formValidationSchema;
  const formState = { ...state };

  return schema.properties.reduce((formErrors, prop) => {
    const { key } = prop;
    formErrors[key] = validateField(prop, formState[key], formState, schema);
    return formErrors;
  },
    { ...errors },
  );
};

class ProgramRegistrySwitcher extends React.Component<any, any> {
  render() {
    const { showForm } = this.props;
    if (!showForm) {
      return null;
    }

    const { element } = this.props;

    if (isEmpty(element)) {
      return (
        <ProgramRegistryFormCreateWrap
          defSendFromState={defSendFromState}
          getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
          validate={validate}
          {...this.props}
        />
      );
    }
    return (
      <ProgramRegistryFormUWrap
        defSendFromState={defSendFromState}
        getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
        validate={validate}
        {...this.props}
        entity={'repair_program_version'}
      />
    );
  }
}

export default ProgramRegistrySwitcher;
