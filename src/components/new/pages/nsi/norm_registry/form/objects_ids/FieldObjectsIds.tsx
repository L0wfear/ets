import * as React from 'react';
import { get } from 'lodash';

import ExtField from 'components/@next/@ui/renderFields/Field';
import useForm from 'components/@next/@form/hook_selectors/useForm';
import { Norm } from 'redux-main/reducers/modules/some_uniq/norm_registry/@types';
import { etsUseDispatch, etsUseSelector } from 'components/@next/ets_hoc/etsUseDispatch';
import { getSomeUniqState } from 'redux-main/reducers/selectors';
import { actionGetAndSetInStoreTechnicalOperationObjects } from 'redux-main/reducers/modules/some_uniq/technical_operation_objects/technical_operation_objects_actions';

type Props = {
  formDataKey: 'norm';
};

const FieldObjectsIds: React.FC<Props> = React.memo(
  (props) => {
    const meta = useForm.useFormDataMeta<Norm>(props.formDataKey);
    const formStateValue = useForm.useFormDataFormStatePickValue<Norm, Norm['objects_ids']>(props.formDataKey, 'objects_ids');
    const error = useForm.useFormDataFormErrorsPickValue<Norm, string>(props.formDataKey, 'objects_ids');
    const handleChange = useForm.useFormDataHandleChange<Norm>(props.formDataKey);
    const isPermitted = false; // useForm.useFormDataIsPermitted<Norm>(props.formDataKey);

    const handleChangeWrap = React.useCallback(
      (event) => {
        const value = get(event, 'target.value', event);
        handleChange({ objects_ids: value || null });
      },
      [handleChange],
    );

    const dispatch = etsUseDispatch();
    const technicalOperationObjectsList = etsUseSelector((state) => getSomeUniqState(state).technicalOperationObjectsList);
    React.useEffect(
      () => {
        dispatch(actionGetAndSetInStoreTechnicalOperationObjects({}, meta));
      },
      [],
    );

    const options = React.useMemo(
      () => {
        return technicalOperationObjectsList.map((rowData) => ({
          value: rowData.id,
          label: rowData.full_name,
          rowData,
        }));
      },
      [technicalOperationObjectsList],
    );

    return (
      <ExtField
        id={`${meta.path}_objects_ids`}
        type="select"
        multi
        label='Объект'
        value={formStateValue}
        options={options}
        error={error}
        onChange={handleChangeWrap}
        disabled={!isPermitted}
      />
    );
  },
);

export default FieldObjectsIds;
