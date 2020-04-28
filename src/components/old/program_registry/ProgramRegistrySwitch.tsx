import * as React from 'react';
import { cloneDeep } from 'lodash';
import { isObject } from 'util';

import { isEmpty } from 'utils/functions';

import { formValidationSchema } from 'components/old/program_registry/schema';
import ProgramRegistryFormCreateWrap from 'components/old/program_registry/CreateForm/ProgramRegistryFormCWrap';
import ProgramRegistryFormUWrap from 'components/old/program_registry/UpdateFrom/ProgramRegistryFormUWrap';
import { registryLoadDataByKey } from 'components/new/ui/registry/module/actions-registy';
import { etsUseDispatch, EtsDispatch } from 'components/@next/ets_hoc/etsUseDispatch';
import { validate } from 'components/old/ui/form/new/validate';
import { ProgramRegistry } from 'redux-main/reducers/modules/repair/program_registry/@types/programRegistry';

const defSendFromState = (page: string, dispatch: EtsDispatch) => ({ callback, outFormState }) => {
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

  Object.entries(schema.properties).forEach(([key, p]) => {
    if (p.type === 'number' && p.float) {
      formState[key] = !isNaN(formState[key]) && formState[key] !== null ? parseFloat(formState[key]) : null;
    }
    if (p.type === 'number' && p.integer) {
      const parsedValue = parseInt(formState[key], 10);
      formState[key] = !isNaN(parsedValue) ? parsedValue : null;
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

const validateProgramRegistry = (formState: Partial<ProgramRegistry>) => {
  return validate(
    formValidationSchema,
    formState,
    {},
    formState,
  );
};

const getFrowmStateAndErrorAndCanSave = (elementOld: ProgramRegistry = null) => {
  let element: Partial<ProgramRegistry> = {};
  if (elementOld !== null) {
    element = cloneDeep(elementOld);
  } else {
    element = {};
  }
  const formErrors = validateProgramRegistry(element);

  return {
    formState: element,
    formErrors,
    canSave: !Object.values(formErrors).some((value) => !!value),
  };
};

const ProgramRegistrySwitcher: React.FC<any> = React.memo(
  (props) => {
    const { element } = props;

    const dispatch = etsUseDispatch();

    const defSendFromStateWrap = React.useMemo(
      () => {
        return defSendFromState(props.page, dispatch);
      },
      [props.page],
    );

    return (
      isEmpty(element) || (isObject(element) && !Object.keys(element)[0])
        ? (
          <ProgramRegistryFormCreateWrap
            defSendFromState={defSendFromStateWrap}
            getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
            validate={validateProgramRegistry}
            showForm
            onFormHide={props.handleHide}
            {...props}
          />
        )
        : (
          <ProgramRegistryFormUWrap
            defSendFromState={defSendFromStateWrap}
            getFrowmStateAndErrorAndCanSave={getFrowmStateAndErrorAndCanSave}
            validate={validateProgramRegistry}
            onFormHide={props.handleHide}
            {...props}
            showForm
            entity={'repair_program_version'}
          />
        )
    );
  },
);

export default ProgramRegistrySwitcher;
