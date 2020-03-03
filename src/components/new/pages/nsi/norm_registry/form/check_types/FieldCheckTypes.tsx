import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { actionGetAndSetInStoreTechnicalOperationTypes } from 'redux-main/reducers/modules/some_uniq/technical_operation_types/technical_operation_types_actions';
import { getSomeUniqState } from 'redux-main/reducers/selectors';

type Props = {
  formDataKey: 'norm';
};

const FieldCheckTypes: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['check_types']>(props.formDataKey, 'check_types');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'check_types');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ check_types: value || null });
      },
      [handleChange],
    );

    const dispatch = etsUseDispatch();
    const technicalOperationTypesList = etsUseSelector((state) => getSomeUniqState(state).technicalOperationTypesList);
    React.useEffect(
      () => {
        dispatch(actionGetAndSetInStoreTechnicalOperationTypes({}, meta));
      },
      [],
    );

    const options = React.useMemo(
      () => {
        return technicalOperationTypesList.map((rowData) => ({
          value: rowData.key,
          label: rowData.name,
          rowData,
        }));
      },
      [technicalOperationTypesList],
    );

    return (
      <ExtField
        id={`${meta.path}_check_types`}
        type="select"
        multi
        label='Тип проверки'
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldCheckTypes;
