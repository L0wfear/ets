import * as React from 'react';
import { cloneDeep } from 'lodash';

import { isEmpty } from 'utils/functions';
import { validateField } from 'utils/validate/validateField';

import { formValidationSchema } from 'components/old/program_registry/schema';
import ProgramRegistryFormCreateWrap from 'components/old/program_registry/CreateForm/ProgramRegistryFormCWrap';
import ProgramRegistryFormUWrap from 'components/old/program_registry/UpdateFrom/ProgramRegistryFormUWrap';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch } from 'components/@next/ets_hoc/etsUseDispatch';

const defSendFromState = (page, dispatch) => ({ callback, outFormState }) => {
  const schema = formValidationSchema;
  const formState = Object.entries(outFormState).reduce((newFormState, [key, val]) => {
    if (typeof val === 'string') {
      return {
        ...newFormState,
        [key]: val.trim(),
      };
    }

    return { ...newFormState, [key]: val };
  }, {});

  schema.properties.forEach((p) => {
    if (p.type === 'number' && p.float) {
      formState[p.key] = !isNaN(formState[p.key]) && formState[p.key] !== null ? parseFloat(formState[p.key]) : null;
    }
    if (p.type === 'number' && p.integer) {
      const parsedValue = parseInt(formState[p.key], 10);
      formState[p.key] = !isNaN(parsedValue) ? parsedValue : null;
    }
  });

  return callback(formState).then(
    async (ans) => {
      await dispatch(
        registryLoadDataByKey(page),
      );

      return ans;
    },
  );
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
    canSave: !Object.values(formErrors).some((value) => !!value),
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

const ProgramRegistrySwitcher: React.FC<any> = React.memo(
  (props) => {
    const { showForm } = props;
    if (!showForm) {
      return null;
    }

    const { element } = props;

    const dispatch = etsUseDispatch();

    const defSendFromStateWrap = React.useMemo(
      () => {
        return defSendFromState(props.page, dispatch);
      },
      [props.page],
    );

    return React.useMemo(
      () => {
        return (
          isEmpty(element)
            ? (
              <ProgramRegistryFormCreateWrap
                defSendFromState={defSendFromStateWrap}
                getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
                validate={validate}
                {...props}
              />
            )
            : (
              <ProgramRegistryFormUWrap
                defSendFromState={defSendFromStateWrap}
                getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
                validate={validate}
                {...props}
                entity={'repair_program_version'}
              />
            )
        );
      },
      [
        props,
        element,
        defSendFromStateWrap,
        getFrowmStateAndErrorAndCanSave,
        validate,
      ],
    );

  },
);

export default ProgramRegistrySwitcher;
